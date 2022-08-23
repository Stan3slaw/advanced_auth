interface Config {
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export default (): Config => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.EXPIREIN || '120s',
  },
});
