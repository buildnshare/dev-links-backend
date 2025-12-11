import * as bcrypt from  'bcrypt';

const saltRounds = 10;

export async function hashPassword(password: string) {
    try {
        let hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error(err);
        return err instanceof Error ? err.message : 'hash password error';
    }
}