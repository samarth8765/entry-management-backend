import Crypto from 'node:crypto';

const random = (max = 16, min = 0): number => Crypto.randomInt(min, max);

export const GeneratePublicId = (
  length: number,
  options: {
    numbers?: boolean;
    alpha?: boolean;
  } = {
    numbers: true,
    alpha: true
  }
): string => {
  const generate = () => {
    let result = '';
    let characters = '';
    if (options?.numbers || typeof options.numbers === 'undefined') {
      characters += '0123456789';
    }
    if (options?.alpha || typeof options.alpha === 'undefined') {
      characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(random(charactersLength));
    }
    return result;
  };
  const publicId = generate();
  return publicId;
};
