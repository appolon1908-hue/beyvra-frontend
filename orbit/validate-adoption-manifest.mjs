import { readFileSync } from 'node:fs';

const manifestPath = new URL('./adoption-manifest.json', import.meta.url);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const EXPECTED_ORBIT_SOURCE =
  '59994f618dda555264e45a5e49c05ec65325d035';
const EXPECTED_PACKAGES = [
  '@corporate/auth-ui',
  '@corporate/brand-registry',
  '@corporate/content-sdk',
  '@corporate/design-tokens',
  '@corporate/eslint-config',
  '@corporate/icons',
  '@corporate/stylelint-config',
  '@corporate/testing',
  '@corporate/ui',
];
const REQUIRED_ROUTE_CLASSES = [
  'marketing-and-public',
  'trading',
  'account',
  'activity',
  'operator',
  'identity-callbacks-and-recovery',
  'logout-and-session-expiry',
  'kyc-and-onboarding',
  'lender',
  'administration',
  'legal-and-content-review',
  'redirects',
  'wildcard-and-failure',
];
const REQUIRED_STATES = [
  'loading',
  'empty',
  'timeout',
  'offline',
  'expired-session',
  'provider-unavailable',
  'stale-data',
  'partial-data',
  'mutation-failure',
  'unknown-outcome',
  'unauthorized',
  'forbidden',
  'not-found',
  'maintenance',
];

const assert = (condition, message) => {
  if (!condition) throw new Error(`ORBIT_ADOPTION_INVALID: ${message}`);
};

const assertExactMembers = (actual, expected, label) => {
  assert(Array.isArray(actual), `${label} must be an array`);
  const normalizedActual = [...actual].sort();
  const normalizedExpected = [...expected].sort();
  assert(
    JSON.stringify(normalizedActual) === JSON.stringify(normalizedExpected),
    `${label} must exactly match the governed inventory`,
  );
};

assert(manifest.schemaVersion === '2.1.0', 'schemaVersion must be 2.1.0');
assert(
  manifest.status === 'blocked-pending-implementation-and-evidence',
  'draft adoption must remain blocked',
);
assert(manifest.adoptionMode === 'full-shell', 'adoptionMode must be full-shell');
assert(manifest.domain === null, 'unregistered domain must remain null');
assert(
  manifest.domainStatus === 'pending-registration',
  'domain must remain pending registration',
);

const authority = manifest.orbitAuthority;
assert(authority?.repository === 'appolon1908-hue/SDK-repository', 'wrong Orbit repository');
assert(authority?.sourcePullRequest === 75, 'wrong Orbit source pull request');
assert(authority?.protectedMainSha === EXPECTED_ORBIT_SOURCE, 'wrong protected Orbit SHA');
assert(authority?.packageVersion === '2.0.0', 'wrong Orbit package version');
assert(authority?.mutableRangesAllowed === false, 'mutable package ranges are prohibited');
assert(
  authority?.publishStatus ===
    'blocked-pending-protected-post-merge-package-release',
  'unpublished Orbit artifacts must remain blocked',
);

const packages = authority?.requiredPackages;
assert(Array.isArray(packages), 'requiredPackages must be an array');
assertExactMembers(
  packages.map((entry) => entry.name),
  EXPECTED_PACKAGES,
  'required package names',
);
for (const entry of packages) {
  assert(entry.version === '2.0.0', `${entry.name} must use exact version 2.0.0`);
  assert(!/[~^*xX]/.test(entry.version), `${entry.name} uses a mutable version`);
  assert(entry.sourceSha === EXPECTED_ORBIT_SOURCE, `${entry.name} has the wrong source SHA`);
  assert(entry.integrity === null, `${entry.name} must not invent unpublished integrity`);
  assert(entry.lockfileEntry === false, `${entry.name} is not yet lockfile-certified`);
  assert(entry.installAllowed === false, `${entry.name} is not yet installable`);
}

const security = manifest.securityBoundary;
assert(security?.apiOrigin === 'same-origin', 'API origin must remain same-origin');
assert(security?.apiBasePath === '/api', 'API base path must remain /api');
assert(
  security?.webSocketOrigin === 'same-origin',
  'WebSocket origin must remain same-origin',
);
assert(security?.webSocketBasePath === '/ws', 'WebSocket base path must remain /ws');
assert(
  security?.cookieSession === 'secure-http-only-backend-cookie',
  'session authority must remain the secure HttpOnly backend cookie',
);
assert(security?.credentialsMode === 'include', 'credentialed requests must include cookies');
assert(
  security?.browserAuthorizationTokenAllowed === false,
  'browser authorization tokens are prohibited',
);
assert(
  security?.csrfBootstrapEndpoint === '/api/v1/auth/oidc/csrf/',
  'wrong CSRF bootstrap endpoint',
);
assert(
  security?.csrfRequiredForUnsafeMethods === true,
  'unsafe requests must require CSRF',
);
assert(
  security?.identityRedirectsThroughBffOnly === true,
  'identity redirects must remain BFF-owned',
);
assert(security?.complete === false, 'security evidence is not complete');

const requirements = manifest.requirements;
for (const requirement of [
  'immutablePackageCoordinates',
  'lockfileIntegrityEvidence',
  'sameOriginApiBff',
  'sameOriginWebSocketBff',
  'credentialedCookieSession',
  'csrfBootstrapForUnsafeRequests',
  'exhaustiveRouteInventory',
  'stateManifest',
  'failureStateEvidence',
  'accessibilityEvidence',
  'rollbackEvidence',
]) {
  assert(requirements?.[requirement] === true, `missing requirement ${requirement}`);
}

assert(manifest.routeInventory?.exhaustiveRequired === true, 'route inventory must be exhaustive');
assert(
  manifest.routeInventory?.nestedWorkspaceSurfacesRequired === true,
  'nested workspace surfaces must be inventoried',
);
assertExactMembers(
  manifest.routeInventory?.routeClasses,
  REQUIRED_ROUTE_CLASSES,
  'route classes',
);
assert(manifest.routeInventory?.complete === false, 'route inventory is not complete');

assertExactMembers(
  manifest.stateManifest?.requiredStates,
  REQUIRED_STATES,
  'required states',
);
assert(manifest.stateManifest?.complete === false, 'state evidence is not complete');

for (const [name, evidence] of Object.entries(manifest.validationEvidence ?? {})) {
  assert(evidence.required === true, `${name} evidence must be required`);
  assert(evidence.complete === false, `${name} evidence must remain incomplete`);
  assert(Array.isArray(evidence.artifacts), `${name} artifacts must be an array`);
}
assert(
  Object.keys(manifest.validationEvidence ?? {}).length === 6,
  'all six evidence groups are required',
);
assert(Array.isArray(manifest.blockers) && manifest.blockers.length >= 5, 'blockers are incomplete');

console.log(`ORBIT_ADOPTION_MANIFEST=PASS`);
console.log(`ORBIT_AUTHORITY_SHA=${EXPECTED_ORBIT_SOURCE}`);
console.log(`ORBIT_REQUIRED_PACKAGES=${EXPECTED_PACKAGES.length}`);
console.log(`ORBIT_ROUTE_CLASSES=${REQUIRED_ROUTE_CLASSES.length}`);
console.log(`ORBIT_FAILURE_STATES=${REQUIRED_STATES.length}`);
console.log('ORBIT_ADOPTION_COMPLETE=NO');
