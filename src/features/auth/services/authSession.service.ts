class AuthSessionService {
  private isAuthenticated: boolean = false;

  setAuthenticated(value: boolean): void {
    this.isAuthenticated = value;
  }

  getAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  clearSession(): void {
    this.isAuthenticated = false;
  }
}

export const authSessionService = new AuthSessionService();
