import NextAuth from "next-auth" //verificar se é mesmo /react
import GithubProvider from "next-auth/providers/github"
import { fauna } from '../../../services/fauna'
import { query as q} from 'faunadb'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
      
    }),
    // ...add more providers here
  ],
  // jwt: {
  //   signingKey: process.env.SIGNING_KEY,
  // },

  callbacks: {

    async signIn({ user, account, profile }) {
      // console.log(user);
      // return true
      const { email } = user;
      
      try{
        await fauna.query(
          q.If (
            q.Not (
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email }}
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true
      } catch {
        return false
      }
    },

    session: async ({ session }) => {
      try {
        session.user.email
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )
  
        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
        
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
  }

})