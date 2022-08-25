interface Config {
  accessToken: {
    secret: string;
    expiresIn: string;
  };
  refreshToken: {
    secret: string;
    expiresIn: string;
  };
}

export default (): Config => ({
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET || 'secret',
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIREIN || '120s',
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET || 'secret',
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIREIN || '7d',
  },
});
