const openpgpModule = import(
    /* webpackChunkName: "openpgp,  webpackPrefetch: true" */ 'openpgp'
)

async function encrypt(dataToEncrypt, publicKeyObj) {
    const publicKey = publicKeyObj["publicKey"]
    const keyId = publicKeyObj["keyId"]
    const decodedPublicKey = atob(publicKey, 'base64')
    const openpgp = await openpgpModule
    const options = {
        message: openpgp.message.fromText(JSON.stringify(dataToEncrypt)),
        publicKeys: (await openpgp.key.readArmored(decodedPublicKey)).keys,
    }

    return openpgp.encrypt(options).then((ciphertext) => {
        return {
            encryptedMessage: btoa(ciphertext.data),
            keyId: keyId,
        }
    })
}

export default encrypt;