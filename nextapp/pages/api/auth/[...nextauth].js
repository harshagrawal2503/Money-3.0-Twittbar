import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import TwitterClient from '../../../helpers/TwitterClient';

export default NextAuth({
  secret: process.env.NEXT_PUBLIC_SECRET,
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CONSUMER_KEY,
      clientSecret: process.env.TWITTER_CONSUMER_SECRET
      // clientId: process.env.TWITTER_CLIENT_ID,
      // clientSecret: process.env.TWITTER_CLIENT_SECRET,
      // version: "2.0",
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user.id = token.sub;

      const client = TwitterClient.v2();
      const result = await client.get('users/' + token.sub);
      Object.assign(session.user, result.data);

      return session
    },
    // async jwt(token, user, account = {}, profile, isNewUser) {
    //   if ( account.provider && !token[account.provider] ) {
    //     token[account.provider] = {};
    //   }

    //   if ( account.accessToken ) {
    //     token[account.provider].accessToken = account.accessToken;
    //   }

    //   if ( account.refreshToken ) {
    //     token[account.provider].refreshToken = account.refreshToken;
    //   }

    //   console.log('jwt', token, user, account, profile, isNewUser);
    //   return token;
    // },
  }
});
