/**
 * 
 */
export interface QueryBuilder {
  toQueryMap: () => Map<string, string>;
  toQueryString: () => string;
}
/**
 * 
 */
export class QueryOptions implements QueryBuilder {
  /**
   * 
   */
  public pageNumber: number;
  /**
   * 
   */
  public pageSize: number;

  /**
   * Constructeur
   */
  constructor() {
    this.pageNumber = 1;
    this.pageSize = 10000;
  }

  /**
   * 
   */
  toQueryMap(): Map<string, string> {
    const queryMap = new Map<string, string>();
    queryMap.set('pageNumber', `${this.pageNumber}`);
    queryMap.set('pageSize', `${this.pageSize}`);

    return queryMap;
  }

  /**
   * 
   */
  toQueryString(): string {
    let queryString = '';
    this.toQueryMap().forEach((value: string, key: string) => {
      queryString = queryString.concat(`${key}=${value}&`);
    });

    return queryString.substring(0, queryString.length - 1);
  }
}
