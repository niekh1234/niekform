export interface CaptchaSolver {
  solve(): Promise<boolean>;
}
