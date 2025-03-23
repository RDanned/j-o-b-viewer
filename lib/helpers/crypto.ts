export function convertLovelaceToAda(quantity: number): number {
  return quantity / 1_000_000;
}

export async function getAdaPriceInUSD() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd');
  const data = await response.json();
  return data.cardano.usd;
}

export async function convertLovelaceToUSD(lovelaceAmount: number) {
  const adaAmount = convertLovelaceToAda(lovelaceAmount);
  const adaPriceUSD = await getAdaPriceInUSD();
  return adaAmount * adaPriceUSD;
}

export function shortenString(str: string, frontChars = 30, backChars = 30) {
  if (str.length <= frontChars + backChars) {
    return str;
  }
  return (
    str.substring(0, frontChars) +
    '....' +
    str.substring(str.length - backChars)
  );
}