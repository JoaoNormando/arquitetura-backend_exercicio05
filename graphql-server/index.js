import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fetch from 'node-fetch';

const typeDefs = `#graphql
  
    type Message {
        message: String
    }

    type Item {
        id: String
        name: String
        votes: Int 
    }

    type Enquete {
        id: Int,
        name: String,
        items: [Item]
    }
  
    type Query {
      enquetes: [Enquete]
    }
  
    input EnqueteItemInput {
        id: String
        name: String
        votes: Int 
    }

    type Mutation {
      addEnquete(name: String, items: [EnqueteItemInput]): Enquete
      addVote(id: Int, idItem: String): Message 
      removeVote(id: Int, idItem: String): Message 
    }
  `;

const resolvers = {
    Query: {
        enquetes: () => findAllEnquetes()
    },
    Mutation: {
        addEnquete: (_, { name, items }) => {
            const enquete = { name, items }
            return createEnquete(enquete)
        },
        addVote: (_, { id, idItem }) => addEnqueteVote(id, idItem),
        removeVote: (_, { id, idItem }) => removeEnqueteVote(id, idItem)
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
});

function findAllEnquetes() {
    return fetch('http://localhost:3000/enquetes', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then((response) => response.json())
}

function createEnquete(enquete) {
    return fetch('http://localhost:3000/enquetes', {
        method: 'POST',
        body: JSON.stringify(enquete),
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => response.json())
}

function addEnqueteVote(id, idItem) {
    return fetch(`http://localhost:3000/enquetes/${id}/items/${idItem}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => response.json())

}

function removeEnqueteVote(id, idItem) {
    return fetch(`http://localhost:3000/enquetes/${id}/items/${idItem}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then((response) => response.json())

}

console.log(`🚀  Server ready at: ${url}`);