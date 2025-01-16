  export const createCustomMarker1 = (price:string, lineWidth = 170) => {
    const marker = document.createElement('div');
    marker.id= 'textElement1'
    marker.style.display = 'flex';
    marker.style.position = 'absolute';
    marker.style.zIndex = '10';
  
    const diamondContainer = document.createElement('div');
    diamondContainer.className = "diamond-container";
    diamondContainer.style.position = 'relative';
    diamondContainer.style.display = 'flex';
    diamondContainer.style.justifyContent = 'center';
    diamondContainer.style.alignItems = 'center';
    diamondContainer.dataset.width = `${lineWidth}px`; 
 
  
    const diamond = document.createElement('div');
    diamond.style.width = '14px';
    diamond.style.height = '14px';
    diamond.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; 
    diamond.style.transform = 'rotate(45deg)';
    diamond.style.display = 'flex';
    diamond.style.justifyContent = 'center';
    diamond.style.alignItems = 'center';
    diamond.style.zIndex = '10';
  
    const innerDiamond = document.createElement('div');
    innerDiamond.className = "diamond";
    innerDiamond.style.width = '6px';
    innerDiamond.style.height = '6px';
    innerDiamond.style.backgroundColor = 'white';
  
    diamond.appendChild(innerDiamond);
    diamondContainer.appendChild(diamond);
  
    const lineContainer = document.createElement('div');
    lineContainer.style.display = 'flex';
    lineContainer.style.justifyContent = 'center';
    lineContainer.style.alignItems = 'center';
    lineContainer.style.zIndex = '0';
    lineContainer.style.marginLeft = '-8px'; 
  
    const line = document.createElement('div');
    line.className = "line-width relative";
    line.style.backgroundColor = 'white';
    line.style.height = '1px';
    line.style.width = `${lineWidth}px`; 

  
    lineContainer.appendChild(line);
  
    const textContainer = document.createElement('div');
    textContainer.style.display = 'flex';
    textContainer.style.justifyContent = 'center';
    textContainer.style.alignItems = 'center';
  
    const text = document.createElement('span');
    text.style.backgroundColor = 'white';
    text.id = "price-text";
    text.style.color = "black"
    text.style.fontSize = "12px"
    text.style.borderRadius = '9999px'; 
    text.style.padding = '3px 7px'; 
    text.style.fontWeight = '600';
    text.textContent = price;
  
    textContainer.appendChild(text);
    // marker.appendChild(diamondContainer);
    marker.appendChild(diamondContainer);
    marker.appendChild(lineContainer);
    marker.appendChild(textContainer);
  
    return marker;
  };



export const createCustomMarker2 = ( price:string,trade:string) => {
    const marker = document.createElement('div');
    marker.style.display = 'flex';
    marker.id= 'textElement2'

    marker.style.position = 'absolute';
    marker.style.zIndex = '5';
  
    const circle = document.createElement('div');
    circle.style.backgroundColor = 'white';
    circle.style.borderRadius = '1000px';
    circle.style.width = '8px'; 
    circle.style.height = '8px'; 
    circle.style.position = 'relative';

    const labelInner = document.createElement('div');
    labelInner.style.display = 'flex';
    labelInner.style.backgroundColor = `${trade === 'up' ? "rgb(22, 163, 74)" : trade === 'down'  ? "#FF0000" : null} `;
    labelInner.style.height = '20.5px';
    labelInner.style.width = '70px';
    labelInner.style.borderRadius = '6px';
    labelInner.style.padding = '1.5px 3.5px 1.5px 0px';
    labelInner.style.position = 'absolute';
    labelInner.style.left = '-248px';
    labelInner.style.top = '-7px';

    


    const span = document.createElement('span');
    span.textContent = `$${price}`;
    span.style.color = 'white';
    span.style.paddingLeft = '8px';
    span.style.paddingRight = '0px';
    span.style.fontSize = '12px';
    span.style.paddingTop = '2px';
    span.style.paddingBottom = '0';

    const svgContainer = document.createElement('div');
    svgContainer.style.marginTop = `${trade === 'down' ? '-2.1px' : '-5.3px'}`;
    svgContainer.style.marginLeft = '0px';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '22px');
    svg.setAttribute('height', '29px');
    svg.setAttribute('viewBox', '0 0 190.00 190.00');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('transform', `${trade === 'down' ? 'rotate(90, 0, 0)' : 'rotate(0, 0, 0)'}`);
    svg.setAttribute('stroke', '#ffffff');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttribute('clip-rule', 'evenodd');
    path.setAttribute('d', 'M96.207 95.3649L51.967 142.36L39.391 129.784L85.168 85.1059L57.322 88.0569L56.98 71.8369L107.371 72.8129L110.609 124.815L94.332 125.173L96.207 95.3649Z');
    path.setAttribute('fill', '#ffffff');

    svg.appendChild(path);
    svgContainer.appendChild(svg);
  
    const solidLine = document.createElement('div');
    solidLine.style.width = '228px'; 
    solidLine.style.backgroundColor = `${trade === 'up' ? "rgb(22, 163, 74)" : trade === 'down'  ? "#FF0000" : null} `; 
    solidLine.style.height = '0.1px';
    solidLine.style.borderWidth = '0.1px';
    solidLine.style.borderStyle = 'solid';
    solidLine.style.borderColor = `${trade === 'up' ? "rgb(22, 163, 74)" : trade === 'down'  ? "#FF0000" : null} `;
    solidLine.style.position = 'absolute';
    solidLine.style.top = '3.1px';
    solidLine.style.left = '8.5px';
  
    const dashedLine = document.createElement('div');
    dashedLine.style.width = '182px'; 
    dashedLine.style.height = '0.1px';
    dashedLine.style.borderWidth = '0.1px';
    dashedLine.style.borderStyle = 'dashed';
    dashedLine.style.borderColor = `${trade === 'up' ? "rgb(22, 163, 74)" : trade === 'down'  ? "#FF0000" : null} `; 
    dashedLine.style.position = 'absolute';
    dashedLine.style.top = '3.1px';
    dashedLine.style.right = '8px';

    marker.appendChild(labelInner)
    labelInner.appendChild(span)
    labelInner.appendChild(svgContainer)
    circle.appendChild(solidLine);
    circle.appendChild(dashedLine);
    marker.appendChild(circle);
  
    return marker;
  };

  export const createCustomMarker3 = ( price:number,trade:string) => {
    const marker = document.createElement('div');
    marker.style.display = 'flex';
    marker.id= 'textElement3'
    marker.style.position = 'absolute';
    marker.style.zIndex = '10';

    const span = document.createElement('span');
    span.textContent = `+$${price * 0.85}`;
    span.style.color = `${trade === 'up' ? "rgb(22, 163, 74)" : trade === 'down'  ? "#FF0000" : null} `;
    span.style.fontWeight = '600'
    span.style.paddingLeft = '8px';
    span.style.paddingRight = '4px';
    span.style.fontSize = '13px';
    span.style.paddingTop = '2px';
    span.style.paddingBottom = '0';

    marker.appendChild(span)

    return marker
  }


  export const FinishedTradeMarker = (price:number, trade:string)=>{
    const marker = document.createElement('div');
    marker.style.backgroundColor = `${trade == 'won' ? 'green' : 'red'}`;
    marker.id= 'textElement4'
    marker.style.color = 'white';
    marker.style.width = '85px'
    marker.style.zIndex = '10'
    marker.style.padding = '0.15rem 0.35rem';
    marker.style.position = 'absolute';
    marker.style.clipPath = 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)';

    const resultHeading = document.createElement('h2');
    resultHeading.textContent = 'Result';
    resultHeading.style.fontWeight = '400';
    resultHeading.style.fontSize = '15px';
    marker.appendChild(resultHeading);

    const priceContainer = document.createElement('div');
    priceContainer.style.display = 'flex';

    const dollarSign = document.createElement('h2');
    dollarSign.textContent = '$';
    dollarSign.style.fontWeight = '400';
    resultHeading.style.fontSize = '15px';

    priceContainer.appendChild(dollarSign);

    const priceValue = document.createElement('h2');
    priceValue.textContent = price.toFixed(2);
    priceValue.style.fontWeight = '400';
    resultHeading.style.fontSize = '15px';

    priceContainer.appendChild(priceValue);

    marker.appendChild(priceContainer);

    return marker;

  }