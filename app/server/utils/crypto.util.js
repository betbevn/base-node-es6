import forge from "node-forge";

const PKI = forge.pki;
const MD = forge.md;

export const getPublicKeyFromPem = (pemPublicKey) =>
  PKI.publicKeyFromPem(pemPublicKey);

export const getPrivateKeyFromPem = (pemPrivateKey) =>
  PKI.privateKeyFromPem(pemPrivateKey);

export const encryptPrivateKey = (privateKey, secret) =>
  PKI.encryptRsaPrivateKey(privateKey, secret);

export const decryptPrivateKey = (pemPrivateKey, secret) =>
  PKI.decryptRsaPrivateKey(pemPrivateKey, secret);

export const makeAuthSignature = (privateKey) => {
  const message = "Let me in";
  const md = MD.sha1.create();
  md.update(message, "utf8");
  const signature = privateKey.sign(md);
  return [message, signature];
};

export const verifyAuthSignature = (publicKey, message, signature) => {
  const md = MD.sha1.create();
  md.update(message, "utf8");
  const verification = publicKey.verify(md.digest().getBytes(), signature);
  return verification;
};
