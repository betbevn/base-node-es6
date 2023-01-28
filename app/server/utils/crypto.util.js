import forge from "node-forge";

const PKI = forge.pki;
const RSA = forge.pki.rsa;
const MD = forge.md;

export const generateKeyPair = (opts) =>
  new Promise((resolve, reject) => {
    RSA.generateKeyPair(opts, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

export const makeKeyPair = () => generateKeyPair({ bits: 2048 });

export const makePublicKeyPem = (publicKey) => PKI.publicKeyToPem(publicKey);

export const makePrivateKeyPem = (publicKey) => PKI.privateKeyToPem(publicKey);

export const getPublicKeyFromPem = (pemPublicKey) =>
  PKI.publicKeyFromPem(pemPublicKey);

export const getPrivateKeyFromPem = (pemPrivateKey) =>
  PKI.privateKeyFromPem(pemPrivateKey);

export const encryptPrivateKey = (privateKey, secret) =>
  PKI.encryptRsaPrivateKey(privateKey, secret);

export const decryptPrivateKey = (pemPrivateKey, secret) =>
  PKI.decryptRsaPrivateKey(pemPrivateKey, secret);

export const makeAuthSignature = async (privateKey, secret) => {
  const message = "Let me in " + Date.now();
  const md = MD.sha1.create();
  md.update(message, "utf8");
  const signature = privateKey.sign(md);
  return [message, signature];
};

export const verifyAuthSignature = async (publicKey, message, signature) => {
  const md = MD.sha1.create();
  md.update(message, "utf8");
  const verification = publicKey.verify(md.digest().getBytes(), signature);
  return verification;
};
