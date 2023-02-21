export function mapErrorCodeToMessage(authCode: string) {
  switch (authCode) {
    case 'auth/wrong-password':
      return 'Email ou senha incorretos';
    case 'auth/invalid-email':
      return 'Email ou senha incorretos';
    case 'auth/too-many-requests':
      return 'Esse usuário fez muitas requisições, aguarde um pouco ou tente entrar com outra conta'
    default:
      return 'Erro ao realizar login';
  }
}