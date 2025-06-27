import { GraphQLQuery, GraphQLResponse, GraphQLSchema, EndpointConfig } from '../types';

export async function executeGraphQLQuery(
  endpoint: EndpointConfig,
  query: GraphQLQuery
): Promise<GraphQLResponse> {
  try {
    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...endpoint.headers,
      },
      body: JSON.stringify({
        query: query.query,
        variables: query.variables ? JSON.parse(query.variables) : undefined,
        operationName: query.operationName,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      errors: [
        {
          message: error instanceof Error ? error.message : 'Network error',
        },
      ],
    };
  }
}

export async function fetchSchema(endpoint: EndpointConfig): Promise<GraphQLSchema> {
  const introspectionQuery = `
    query IntrospectionQuery {
      __schema {
        queryType { name }
        mutationType { name }
        subscriptionType { name }
        types {
          ...FullType
        }
      }
    }
    
    fragment FullType on __Type {
      kind
      name
      description
      fields(includeDeprecated: true) {
        name
        description
        args {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        description
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }
    
    fragment InputValue on __InputValue {
      name
      description
      type { ...TypeRef }
      defaultValue
    }
    
    fragment TypeRef on __Type {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...endpoint.headers,
      },
      body: JSON.stringify({
        query: introspectionQuery,
      }),
    });

    return await response.json();
  } catch (error) {
    return {
      errors: [
        {
          message: error instanceof Error ? error.message : 'Failed to fetch schema',
        },
      ],
    };
  }
}

export function formatGraphQLResponse(response: GraphQLResponse): string {
  return JSON.stringify(response, null, 2);
}

export function validateGraphQLQuery(query: string): { isValid: boolean; error?: string } {
  if (!query.trim()) {
    return { isValid: false, error: 'Query cannot be empty' };
  }

  // Basic validation - check for required GraphQL syntax
  const trimmedQuery = query.trim();
  const validStarters = ['query', 'mutation', 'subscription', '{'];
  const hasValidStart = validStarters.some(
    (starter) => trimmedQuery.startsWith(starter) || trimmedQuery.startsWith(`${starter} `)
  );

  if (!hasValidStart) {
    return { isValid: false, error: 'Query must start with query, mutation, subscription, or {' };
  }

  // Check for balanced braces
  let braceCount = 0;
  for (const char of query) {
    if (char === '{') {
      braceCount++;
    }
    if (char === '}') {
      braceCount--;
    }
  }

  if (braceCount !== 0) {
    return { isValid: false, error: 'Unbalanced braces in query' };
  }

  return { isValid: true };
}

export function validateVariables(variables: string): { isValid: boolean; error?: string } {
  if (!variables.trim()) {
    return { isValid: true };
  }

  try {
    JSON.parse(variables);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid JSON in variables' };
  }
}

export function generateExampleQuery(): GraphQLQuery {
  return {
    query: `query GetUsers($limit: Int) {
  users(limit: $limit) {
    id
    name
    email
    posts {
      id
      title
      content
    }
  }
}`,
    variables: `{
  "limit": 10
}`,
  };
}

export function generateExampleMutation(): GraphQLQuery {
  return {
    query: `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
    createdAt
  }
}`,
    variables: `{
  "input": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}`,
  };
}

export function prettifyQuery(query: string): string {
  // Simple prettification - add proper indentation
  let formatted = '';
  let indentLevel = 0;
  const lines = query.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    if (trimmed.includes('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    formatted += '  '.repeat(indentLevel) + trimmed + '\n';

    if (trimmed.includes('{')) {
      indentLevel++;
    }
  }

  return formatted.trim();
}
