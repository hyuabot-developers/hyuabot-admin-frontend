const englishLetter = /[A-Za-z]/
const number = /[0-9]/
const specialCharacter = /[\p{P}\p{S}]/u

export const PASSWORD_REQUIREMENTS = '8자 이상, UTF-8 기준 72바이트 이하이며 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.'

export const isValidPassword = (password: string) =>
    password.length >= 8 &&
    new TextEncoder().encode(password).length <= 72 &&
    englishLetter.test(password) &&
    number.test(password) &&
    specialCharacter.test(password)
