// utils/jwtUtils.ts

export const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    // Decode URI component in case the JWT was encoded
    return cookieValue ? decodeURIComponent(cookieValue) : undefined;
  }

  return undefined;
};

// Helper function to get JWT token from cookie
export const getJWTToken = (
  cookieName: string = "token"
): string | undefined => {
  return getCookie(cookieName);
};

// Helper function to parse JWT payload (client-side only - don't trust for security)
export const parseJWTPayload = (token: string): any | null => {
  try {
    // Split the token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // Decode the payload (middle part)
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decodedPayload = atob(paddedPayload);

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
};

// Helper function to check if JWT is expired
export const isJWTExpired = (token: string): boolean => {
  const payload = parseJWTPayload(token);
  if (!payload || !payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

// Complete helper function to get valid JWT token
export const getValidJWTToken = (
  cookieName: string = "token"
): string | null => {
  const token = getJWTToken(cookieName);

  if (!token) {
    console.warn("No JWT token found in cookie");
    return null;
  }

  if (isJWTExpired(token)) {
    console.warn("JWT token is expired");
    return null;
  }

  return token;
};
