const NGNaira = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  });

  const format = () => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      });
  }

  const naira_format = (amount: number, currency: string) => {
    switch (currency) {
        case "USD":
            return NGNaira.format(amount)   

        case "BTC":
        return 
    
        default:
            break;
    }

     NGNaira.format(amount);}
  export { naira_format };
  