// Camcine - Auth Service
import { apiRequest, tokenStorage, userStorage } from './apiClient';

const pickToken = (payload) =>
  payload?.data?.token ||
  payload?.data?.access_token ||
  payload?.data?.accessToken ||
  payload?.data?.jwt ||
  payload?.token ||
  payload?.access_token ||
  payload?.accessToken ||
  null;

const pickUser = (payload) =>
  payload?.data?.user ||
  payload?.data?.profile ||
  payload?.data?.user_details ||
  payload?.user ||
  null;

const splitName = (name = '') => {
  const [firstName = '', ...rest] = name.trim().split(/\s+/).filter(Boolean);
  return {
    first_name: firstName,
    last_name: rest.join(' '),
  };
};

const normalizeUser = (user) => {
  if (!user) return null;

  const firstName = user.first_name || user.firstName || '';
  const lastName = user.last_name || user.lastName || '';
  const fullName = user.name || `${firstName} ${lastName}`.trim() || user.email || 'User';

  return {
    ...user,
    first_name: firstName,
    last_name: lastName,
    phone_number: user.phone_number || user.phoneNumber || '',
    name: fullName,
    role: user.role || 'viewer',
    subscription: user.subscription || 'free',
    preferences: user.preferences || {
      languages: user.language_preferences || [],
      regions: user.regions || [],
      autoplay: true,
      subtitles: true,
      quality: 'auto',
    },
    createdAt: user.createdAt || user.created_at,
    updatedAt: user.updatedAt || user.updated_at,
  };
};

const persistSession = (payload) => {
  const token = pickToken(payload);
  const user = normalizeUser(pickUser(payload));

  if (token) {
    tokenStorage.set(token);
  }

  if (user) {
    userStorage.set(user);
  }

  return user;
};

export const authService = {
  async login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const user = persistSession(response);
    if (!user) {
      throw new Error('Login succeeded, but user details were not returned.');
    }

    return user;
  },

  async register(email, password, name, details = {}) {
    const parsedName = splitName(name);
    const firstName = (details.first_name || parsedName.first_name).trim();
    const lastName = (details.last_name || parsedName.last_name).trim();

    if (!firstName || !lastName) {
      throw new Error('Please enter your first and last name.');
    }

    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        first_name: firstName,
        last_name: lastName,
        phone_number: (details.phone_number || details.phoneNumber || '').trim(),
        password,
        role: details.role || 'viewer',
        age: details.age ? Number(details.age) : undefined,
      }),
    });

    const user = persistSession(response);
    if (user && pickToken(response)) {
      return user;
    }

    return this.login(email, password);
  },

  async logout() {
    tokenStorage.remove();
    userStorage.remove();
  },

  async getCurrentUser() {
    if (!tokenStorage.get()) {
      userStorage.remove();
      return null;
    }

    try {
      const response = await apiRequest('/auth/me', { method: 'GET' }, true);
      const user = normalizeUser(pickUser(response));

      if (user) {
        userStorage.set(user);
        return user;
      }
    } catch (error) {
      if (error.status === 401) {
        await this.logout();
        return null;
      }
      const cachedUser = userStorage.get();
      if (cachedUser) return normalizeUser(cachedUser);
      throw error;
    }

    return normalizeUser(userStorage.get());
  },

  async updateProfile(userId, updates) {
    const cachedUser = userStorage.get();
    const updatedUser = normalizeUser({ ...cachedUser, ...updates, id: userId || cachedUser?.id });
    userStorage.set(updatedUser);
    return updatedUser;
  },

  async updateSubscription(userId, subscription) {
    return this.updateProfile(userId, { subscription });
  },

  async updatePreferences(userId, preferences) {
    const cachedUser = userStorage.get();
    return this.updateProfile(userId, {
      preferences: {
        ...(cachedUser?.preferences || {}),
        ...preferences,
      },
    });
  },

  async checkContentAccess() {
    return true;
  },

  async forgotPassword(email) {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(resetToken, newPassword) {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        reset_token: resetToken,
        new_password: newPassword,
      }),
    });
  },
};
