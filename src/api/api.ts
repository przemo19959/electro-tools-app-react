/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface UpdateTerminalElementDto {
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
  label?: string;
  /** @format uuid */
  parentId?: string;
  wire?: UpdateWireDto;
  type?: "TN_C" | "TN_C_S" | "TN_S" | "TT";
}

export interface UpdateWireDto {
  diameter?:
    | "D_05"
    | "D_075"
    | "D_1"
    | "D_15"
    | "D_25"
    | "D_40"
    | "D_60"
    | "D_100"
    | "D_160"
    | "D_250"
    | "D_350"
    | "D_500"
    | "D_700"
    | "D_950"
    | "D_1200";
  placement?: "UNDER_PLASTER" | "IN_PIPE_ON_WALL" | "DIRECT_ON_WALL";
  type?: "ONE_WIRE" | "MULTI_WIRE";
  phase?: "ONE" | "THREE";
  /** @format double */
  length?: number;
}

export interface ReadAbstractElementDto {
  /** @format uuid */
  id?: string;
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
  label?: string;
  /** @format uuid */
  parentId?: string;
  wire?: ReadWireDto;
  children?: ReadAbstractElementDto[];
  elementType?:
    | "OVER_CURRENT_PROTECTION"
    | "UNKNOWN"
    | "LOAD"
    | "TERMINAL"
    | "RCD";
}

export interface ReadWireDto {
  diameter?:
    | "D_05"
    | "D_075"
    | "D_1"
    | "D_15"
    | "D_25"
    | "D_40"
    | "D_60"
    | "D_100"
    | "D_160"
    | "D_250"
    | "D_350"
    | "D_500"
    | "D_700"
    | "D_950"
    | "D_1200";
  placement?: "UNDER_PLASTER" | "IN_PIPE_ON_WALL" | "DIRECT_ON_WALL";
  type?: "ONE_WIRE" | "MULTI_WIRE";
  phase?: "ONE" | "THREE";
  /** @format double */
  length?: number;
}

export interface UpdateRcdElementDto {
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
  label?: string;
  /** @format uuid */
  parentId?: string;
  wire?: UpdateWireDto;
  /** @format int32 */
  nominalCurrent?: number;
  /** @format int32 */
  diffCurrent?: number;
  /** @format int32 */
  poleNumber?: number;
}

export interface UpdateProjectDto {
  name?: string;
}

export interface ReadProjectDto {
  /** @format uuid */
  id?: string;
  name?: string;
  createdBy?: string;
  modifiedBy?: string;
  /** @format date-time */
  modifiedDate?: string;
  /** @format int64 */
  elementCount?: number;
}

export interface UpdateOvercurrentProtectionElementDto {
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
  label?: string;
  /** @format uuid */
  parentId?: string;
  wire?: UpdateWireDto;
  type?: "A" | "B" | "C" | "D";
  /** @format int32 */
  amperage?: number;
}

export interface UpdateLoadElementDto {
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
  label?: string;
  /** @format uuid */
  parentId?: string;
  wire?: UpdateWireDto;
  /** @format double */
  drawPower?: number;
  /** @format double */
  powerFactor?: number;
  highStartCurrent?: boolean;
  config?: "STAR" | "DELTA";
  zeroed?: boolean;
}

export interface UpdateAbstractElementDto {
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
  label?: string;
  /** @format uuid */
  parentId?: string;
  wire?: UpdateWireDto;
}

export interface UpdateBasicElementPositionDto {
  /** @format uuid */
  elementId?: string;
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
}

export interface CreateTerminalElementDto {
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
  label?: string;
  /** @format uuid */
  parentId?: string;
  wire?: CreateWireDto;
  /** @format uuid */
  projectId?: string;
  type?: "TN_C" | "TN_C_S" | "TN_S" | "TT";
}

export interface CreateWireDto {
  diameter?:
    | "D_05"
    | "D_075"
    | "D_1"
    | "D_15"
    | "D_25"
    | "D_40"
    | "D_60"
    | "D_100"
    | "D_160"
    | "D_250"
    | "D_350"
    | "D_500"
    | "D_700"
    | "D_950"
    | "D_1200";
  placement?: "UNDER_PLASTER" | "IN_PIPE_ON_WALL" | "DIRECT_ON_WALL";
  type?: "ONE_WIRE" | "MULTI_WIRE";
  phase?: "ONE" | "THREE";
  /** @format double */
  length?: number;
}

export interface CreateRcdElementDto {
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
  label?: string;
  /** @format uuid */
  parentId?: string;
  wire?: CreateWireDto;
  /** @format uuid */
  projectId?: string;
  /** @format int32 */
  nominalCurrent?: number;
  /** @format int32 */
  diffCurrent?: number;
  /** @format int32 */
  poleNumber?: number;
}

export interface CreateProjectDto {
  name?: string;
}

export interface CreateOvercurrentProtectionElementDto {
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
  label?: string;
  /** @format uuid */
  parentId?: string;
  wire?: CreateWireDto;
  /** @format uuid */
  projectId?: string;
  type?: "A" | "B" | "C" | "D";
  /** @format int32 */
  amperage?: number;
}

export interface CreateLoadElementDto {
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
  label?: string;
  /** @format uuid */
  parentId?: string;
  wire?: CreateWireDto;
  /** @format uuid */
  projectId?: string;
  /** @format double */
  drawPower?: number;
  /** @format double */
  powerFactor?: number;
  highStartCurrent?: boolean;
  config?: "STAR" | "DELTA";
  zeroed?: boolean;
}

export interface CreateAbstractElementDto {
  /** @format double */
  x?: number;
  /** @format double */
  y?: number;
  label?: string;
  /** @format uuid */
  parentId?: string;
  wire?: CreateWireDto;
  /** @format uuid */
  projectId?: string;
}

export interface PageReadProjectDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  /** @format int32 */
  size?: number;
  content?: ReadProjectDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface PageableObject {
  /** @format int64 */
  offset?: number;
  paged?: boolean;
  sort?: SortObject;
  unpaged?: boolean;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
}

export interface SortObject {
  empty?: boolean;
  sorted?: boolean;
  unsorted?: boolean;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:8080";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Electro Tools API
 * @version v1
 * @baseUrl http://localhost:8080
 *
 * Swagger documentation for all REST controllers
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  terminalElementController = {
    /**
     * No description
     *
     * @tags terminal-element-controller
     * @name Update
     * @request PUT:/api/v1/terminalElements/{terminalElementId}
     */
    update: (
      terminalElementId: string,
      data: UpdateTerminalElementDto,
      params: RequestParams = {},
    ) =>
      this.request<ReadAbstractElementDto, any>({
        path: `/api/v1/terminalElements/${terminalElementId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags terminal-element-controller
     * @name DeleteById
     * @request DELETE:/api/v1/terminalElements/{terminalElementId}
     */
    deleteById: (terminalElementId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/terminalElements/${terminalElementId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags terminal-element-controller
     * @name Create
     * @request POST:/api/v1/terminalElements
     */
    create: (data: CreateTerminalElementDto, params: RequestParams = {}) =>
      this.request<ReadAbstractElementDto, any>({
        path: `/api/v1/terminalElements`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  rcdElementController = {
    /**
     * No description
     *
     * @tags rcd-element-controller
     * @name Update1
     * @request PUT:/api/v1/rcdElements/{rcdElementId}
     */
    update1: (
      rcdElementId: string,
      data: UpdateRcdElementDto,
      params: RequestParams = {},
    ) =>
      this.request<ReadAbstractElementDto, any>({
        path: `/api/v1/rcdElements/${rcdElementId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags rcd-element-controller
     * @name DeleteById1
     * @request DELETE:/api/v1/rcdElements/{rcdElementId}
     */
    deleteById1: (rcdElementId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/rcdElements/${rcdElementId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags rcd-element-controller
     * @name Create1
     * @request POST:/api/v1/rcdElements
     */
    create1: (data: CreateRcdElementDto, params: RequestParams = {}) =>
      this.request<ReadAbstractElementDto, any>({
        path: `/api/v1/rcdElements`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  projectController = {
    /**
     * No description
     *
     * @tags project-controller
     * @name FindById
     * @request GET:/api/v1/projects/{projectId}
     */
    findById: (projectId: string, params: RequestParams = {}) =>
      this.request<ReadProjectDto, any>({
        path: `/api/v1/projects/${projectId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags project-controller
     * @name Update2
     * @request PUT:/api/v1/projects/{projectId}
     */
    update2: (
      projectId: string,
      data: UpdateProjectDto,
      params: RequestParams = {},
    ) =>
      this.request<ReadProjectDto, any>({
        path: `/api/v1/projects/${projectId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project-controller
     * @name FindAll
     * @request GET:/api/v1/projects
     */
    findAll: (params: RequestParams = {}) =>
      this.request<ReadProjectDto[], any>({
        path: `/api/v1/projects`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags project-controller
     * @name Create2
     * @request POST:/api/v1/projects
     */
    create2: (data: CreateProjectDto, params: RequestParams = {}) =>
      this.request<ReadProjectDto, any>({
        path: `/api/v1/projects`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project-controller
     * @name DeleteAllById
     * @request DELETE:/api/v1/projects
     */
    deleteAllById: (data: string[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/projects`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project-controller
     * @name PageAll
     * @request GET:/api/v1/projects/page
     */
    pageAll: (
      query?: {
        /**
         * Zero-based page index (0..N)
         * @min 0
         * @default 0
         */
        page?: number;
        /**
         * The size of the page to be returned
         * @min 1
         * @default 20
         */
        size?: number;
        /** Sorting criteria in the format: property,(asc|desc). Default sort order is ascending. Multiple sort criteria are supported. */
        sort?: string[];
        query?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PageReadProjectDto, any>({
        path: `/api/v1/projects/page`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
  overcurrentProtectionElementController = {
    /**
     * No description
     *
     * @tags overcurrent-protection-element-controller
     * @name Update3
     * @request PUT:/api/v1/overcurrentProtectionElements/{overcurrentProtectionElementId}
     */
    update3: (
      overcurrentProtectionElementId: string,
      data: UpdateOvercurrentProtectionElementDto,
      params: RequestParams = {},
    ) =>
      this.request<ReadAbstractElementDto, any>({
        path: `/api/v1/overcurrentProtectionElements/${overcurrentProtectionElementId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags overcurrent-protection-element-controller
     * @name DeleteById2
     * @request DELETE:/api/v1/overcurrentProtectionElements/{overcurrentProtectionElementId}
     */
    deleteById2: (
      overcurrentProtectionElementId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/overcurrentProtectionElements/${overcurrentProtectionElementId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags overcurrent-protection-element-controller
     * @name Create3
     * @request POST:/api/v1/overcurrentProtectionElements
     */
    create3: (
      data: CreateOvercurrentProtectionElementDto,
      params: RequestParams = {},
    ) =>
      this.request<ReadAbstractElementDto, any>({
        path: `/api/v1/overcurrentProtectionElements`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  loadElementController = {
    /**
     * No description
     *
     * @tags load-element-controller
     * @name Update4
     * @request PUT:/api/v1/loadElements/{loadElementId}
     */
    update4: (
      loadElementId: string,
      data: UpdateLoadElementDto,
      params: RequestParams = {},
    ) =>
      this.request<ReadAbstractElementDto, any>({
        path: `/api/v1/loadElements/${loadElementId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags load-element-controller
     * @name DeleteById3
     * @request DELETE:/api/v1/loadElements/{loadElementId}
     */
    deleteById3: (loadElementId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/loadElements/${loadElementId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags load-element-controller
     * @name Create4
     * @request POST:/api/v1/loadElements
     */
    create4: (data: CreateLoadElementDto, params: RequestParams = {}) =>
      this.request<ReadAbstractElementDto, any>({
        path: `/api/v1/loadElements`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  basicElementController = {
    /**
     * No description
     *
     * @tags basic-element-controller
     * @name Update5
     * @request PUT:/api/v1/elements/{basicElementId}
     */
    update5: (
      basicElementId: string,
      data: UpdateAbstractElementDto,
      params: RequestParams = {},
    ) =>
      this.request<ReadAbstractElementDto, any>({
        path: `/api/v1/elements/${basicElementId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags basic-element-controller
     * @name UpdatePositions
     * @request PUT:/api/v1/elements/positions
     */
    updatePositions: (
      data: UpdateBasicElementPositionDto[],
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/elements/positions`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags basic-element-controller
     * @name Create5
     * @request POST:/api/v1/elements
     */
    create5: (data: CreateAbstractElementDto, params: RequestParams = {}) =>
      this.request<ReadAbstractElementDto, any>({
        path: `/api/v1/elements`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags basic-element-controller
     * @name Remove
     * @request POST:/api/v1/elements/delete
     */
    remove: (data: string[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/elements/delete`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags basic-element-controller
     * @name GetTrees
     * @request GET:/api/v1/elements/tree
     */
    getTrees: (
      query: {
        /** @format uuid */
        projectId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ReadAbstractElementDto[], any>({
        path: `/api/v1/elements/tree`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
}
