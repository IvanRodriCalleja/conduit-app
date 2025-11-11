/*
  Simple UID generator - generates UID that consists of random non-special characters.
*/
export default function generateUid(prefix = '', length = 8, prefixSeparator = '-'): string {
  let hash = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    hash += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return prefix ? `${prefix}${prefixSeparator}${hash}` : hash;
}
