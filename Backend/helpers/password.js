const brcypt = require('bcrypt')

const hashPassword = (rawPassword) => {
    const saltRounds = 10
    const salt = brcypt.genSaltSync(saltRounds)
    const hashedPassword = brcypt.hashSync(rawPassword,salt)
    return hashedPassword
}
const comparePassword = (rawPassword,hashedPassword)=>{
    return brcypt.compareSync(rawPassword,hashedPassword)
}
module.exports={
    hashPassword,
    comparePassword
}

    