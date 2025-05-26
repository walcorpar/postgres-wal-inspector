
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  error?: string;
  lastConnected?: Date;
}

export interface WalData {
  serviceStatus: string;
  walDirectorySize: string;
  currentLsn: string;
  walFilesSinceRestart: number;
  archiveMode: string;
  activeSlots: number;
  inactiveSlots: number;
  failedArchives: number;
}
