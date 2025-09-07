export const asgardeoConfig = {
  signInRedirectURL: "http://localhost:3000",
  signOutRedirectURL: "http://localhost:3000",
  clientID: "YOUR_CLIENT_ID", // Replace with your Asgardio app client ID
  baseUrl: "https://api.asgardeo.io/t/YOUR_ORG", // Replace with your Asgardio org URL
  scope: ["openid", "profile", "email"],
  resourceServerURLs: ["http://localhost:8080"],
  storage: "localStorage" as const,
  enablePKCE: true,
  enableOIDCSessionManagement: true,
  validateIDToken: true,
  clockTolerance: 300
};

// Environment-specific config with fallbacks
export const getAsgardeoConfig = () => {
  const config = { ...asgardeoConfig };
  
  // Override with environment variables if available
  if (typeof window !== 'undefined') {
    if (process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID) {
      config.clientID = process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID;
    }
    
    if (process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL) {
      config.baseUrl = process.env.NEXT_PUBLIC_ASGARDEO_BASE_URL;
    }
    
    if (process.env.NEXT_PUBLIC_SIGN_IN_REDIRECT_URL) {
      config.signInRedirectURL = process.env.NEXT_PUBLIC_SIGN_IN_REDIRECT_URL;
    }
    
    if (process.env.NEXT_PUBLIC_SIGN_OUT_REDIRECT_URL) {
      config.signOutRedirectURL = process.env.NEXT_PUBLIC_SIGN_OUT_REDIRECT_URL;
    }
  }
  
  // Validate required configuration
  if (!config.clientID || config.clientID === "YOUR_CLIENT_ID") {
    console.warn("⚠️ Asgardio CLIENT_ID not configured. Please set NEXT_PUBLIC_ASGARDEO_CLIENT_ID in your environment variables.");
  }
  
  if (!config.baseUrl || config.baseUrl === "https://api.asgardeo.io/t/YOUR_ORG") {
    console.warn("⚠️ Asgardio BASE_URL not configured. Please set NEXT_PUBLIC_ASGARDEO_BASE_URL in your environment variables.");
  }
  
  return config;
};
