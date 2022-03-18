class HttpException extends Error {
  code: number;
  
  constructor(message: string, code:number) {
    super(message);
    this.name = 'HttpException';
    this.code = code;
  }
}
export {HttpException};