import type { Adapter } from "@auth/core/adapters";
import { createClient } from "@supabase/supabase-js";

export function CustomSupabaseAdapter(
  url: string,
  secret: string
): Adapter {
  const supabase = createClient(url, secret, {
    auth: { persistSession: false },
  });

  const adapter: Adapter = {
    async createUser(user) {
      const { data, error } = await supabase
        .from("users")
        .insert({
          name: user.name,
          email: user.email,
          email_verified: user.emailVerified,
          image: user.image,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        email: data.email!,
        emailVerified: data.email_verified,
        image: data.image,
      };
    },

    async getUser(id) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return null;
      return {
        id: data.id,
        name: data.name,
        email: data.email!,
        emailVerified: data.email_verified,
        image: data.image,
      };
    },

    async getUserByEmail(email) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !data) return null;
      return {
        id: data.id,
        name: data.name,
        email: data.email!,
        emailVerified: data.email_verified,
        image: data.image,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const { data, error } = await supabase
        .from("accounts")
        .select("user_id")
        .eq("provider", provider)
        .eq("provider_account_id", providerAccountId)
        .single();

      if (error || !data) return null;

      return adapter.getUser!(data.user_id);
    },

    async updateUser(user) {
      const { data, error } = await supabase
        .from("users")
        .update({
          name: user.name,
          email: user.email,
          email_verified: user.emailVerified,
          image: user.image,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        email: data.email!,
        emailVerified: data.email_verified,
        image: data.image,
      };
    },

    async linkAccount(account) {
      const { error } = await supabase.from("accounts").insert({
        user_id: account.userId,
        type: account.type,
        provider: account.provider,
        provider_account_id: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      });

      if (error) throw error;
      return account;
    },

    async createSession({ sessionToken, userId, expires }) {
      const { data, error } = await supabase
        .from("sessions")
        .insert({
          session_token: sessionToken,
          user_id: userId,
          expires: expires,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        sessionToken: data.session_token,
        userId: data.user_id,
        expires: new Date(data.expires),
      };
    },

    async getSessionAndUser(sessionToken) {
      const { data: session, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("session_token", sessionToken)
        .single();

      if (error || !session) return null;

      const user = await adapter.getUser!(session.user_id);
      if (!user) return null;

      return {
        session: {
          sessionToken: session.session_token,
          userId: session.user_id,
          expires: new Date(session.expires),
        },
        user,
      };
    },

    async updateSession({ sessionToken, expires, userId }) {
      const { data, error } = await supabase
        .from("sessions")
        .update({
          expires: expires,
          user_id: userId,
        })
        .eq("session_token", sessionToken)
        .select()
        .single();

      if (error) throw error;
      return {
        sessionToken: data.session_token,
        userId: data.user_id,
        expires: new Date(data.expires),
      };
    },

    async deleteSession(sessionToken) {
      await supabase
        .from("sessions")
        .delete()
        .eq("session_token", sessionToken);
    },

    async createVerificationToken({ identifier, expires, token }) {
      const { data, error } = await supabase
        .from("verification_tokens")
        .insert({
          identifier,
          token,
          expires,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        identifier: data.identifier,
        token: data.token,
        expires: new Date(data.expires),
      };
    },

    async useVerificationToken({ identifier, token }) {
      const { data, error } = await supabase
        .from("verification_tokens")
        .delete()
        .eq("identifier", identifier)
        .eq("token", token)
        .select()
        .single();

      if (error || !data) return null;
      return {
        identifier: data.identifier,
        token: data.token,
        expires: new Date(data.expires),
      };
    },
  };

  return adapter;
}
