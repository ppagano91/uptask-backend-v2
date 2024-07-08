import bcrypt from "bcrypt";
export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

export const checkPassword =  async (enteredPassword: string, storeHashedPassword: string) => {
    return await bcrypt.compare(enteredPassword, storeHashedPassword);
}