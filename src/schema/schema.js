import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';
import { Address, queries as addressQueries, resolvers as addressResolvers } from './types/Address';
import { Congregation, queries as congregationQueries, resolvers as congregationResolvers } from './types/Congregation';
import { 
  Territory, 
  queries as territoryQueries, 
  mutations as territoryMutations, 
  queryResolvers as territoryQueryResolvers, 
  mutationResolvers as territoryMutationResolvers 
} from './types/Territory';
import { Publisher, queries as publisherQueries, queryResolvers as publisherQueryResolvers } from './types/Publisher';
import { Status } from './types/Status';
import {
  ActivityLog, 
  ActivityLogInput,
  queries as activityLogQueries,
  mutations as activityLogMutations,
  resolvers as activityLogResolvers,
  mutationResolvers as activityLogMutationResolvers,
} from './types/ActivityLog';

const RootQuery = `
  type RootQuery {
    user(username: String): Publisher
    publisher(firstname: String, lastname: String): Publisher
    ${publisherQueries}
    ${congregationQueries}
    ${territoryQueries}
    ${addressQueries}
    ${activityLogQueries}
  }
`;

const Mutation = `
  type Mutation {
    ${territoryMutations}
    ${activityLogMutations}
  }
`;


const SchemaDefinition = `
  schema {
    query: RootQuery
    mutation: Mutation
  }
`;

const resolvers = {
  RootQuery: merge (
    {}, 
    publisherQueryResolvers,
    congregationResolvers,
    territoryQueryResolvers,
    addressResolvers,
    activityLogResolvers,
  ),

  Mutation: {
    checkoutTerritory: territoryMutationResolvers.checkoutTerritory,
    checkinTerritory: territoryMutationResolvers.checkinTerritory,
    addLog: activityLogMutationResolvers.addLog,
    updateLog: activityLogMutationResolvers.updateLog,
    removeLog: activityLogMutationResolvers.removeLog,
  },

  Publisher: {
    congregation: congregationResolvers.congregation,
  },

  Congregation: {
    territories: territoryQueryResolvers.territories,
    publishers: publisherQueryResolvers.publishers
  },

  Territory: {
    addresses: addressResolvers.addresses,
    status: territoryQueryResolvers.status,
  },

  Address: {
    territory: territoryQueryResolvers.territory,
    activityLogs: activityLogResolvers.activityLogs,
  },
}

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    RootQuery,
    Mutation,
    Congregation,
    Territory,
    Publisher,
    Address,
    Status,
    ActivityLog,
    ActivityLogInput
  ],
  resolvers,
});
