export interface GraphQLQuery {
  query: string;
  variables: string;
  operationName?: string;
}

export interface GraphQLResponse {
  data?: any;
  errors?: GraphQLError[];
  extensions?: any;
}

export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: Array<string | number>;
  extensions?: any;
}

export interface GraphQLSchema {
  data?: {
    __schema: {
      types: GraphQLType[];
      queryType: GraphQLType;
      mutationType?: GraphQLType;
      subscriptionType?: GraphQLType;
    };
  };
  errors?: GraphQLError[];
}

export interface GraphQLType {
  kind: string;
  name: string;
  description?: string;
  fields?: GraphQLField[];
  inputFields?: GraphQLInputValue[];
  interfaces?: GraphQLType[];
  enumValues?: GraphQLEnumValue[];
  possibleTypes?: GraphQLType[];
}

export interface GraphQLField {
  name: string;
  description?: string;
  args: GraphQLInputValue[];
  type: GraphQLType;
  isDeprecated: boolean;
  deprecationReason?: string;
}

export interface GraphQLInputValue {
  name: string;
  description?: string;
  type: GraphQLType;
  defaultValue?: string;
}

export interface GraphQLEnumValue {
  name: string;
  description?: string;
  isDeprecated: boolean;
  deprecationReason?: string;
}

export interface EndpointConfig {
  url: string;
  headers: Record<string, string>;
}

export interface QueryHistory {
  id: string;
  timestamp: number;
  query: string;
  variables: string;
  response?: GraphQLResponse;
  name?: string;
}