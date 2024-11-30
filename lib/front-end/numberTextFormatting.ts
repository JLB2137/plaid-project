export function numberFormatting(number:number) {
    number = Math.round(number*100)/100
    const formatedNumber = number.toLocaleString('en-us')
    return formatedNumber
}

export function toTitleCase(str:string) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

  