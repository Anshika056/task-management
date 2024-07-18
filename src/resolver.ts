import Task from './models/task.model';
import { IResolvers } from '@graphql-tools/utils';

const resolvers: IResolvers = {
  Query: {
    searchTasks: async (_: any, args: { title?: string; author?: string }, context: { user: any }) => {
      const { user } = context;
      console.log(user); 

      if (!user) {
        throw new Error('Unauthorized');
      }

      let query: any = {};

      if (args.title) {
        query.title = new RegExp(args.title, 'i'); 
      }

      if (user.role === 'admin' && args.author) {
        query.author = new RegExp(args.author, 'i');
      }
      
      if (Object.keys(query).length === 0) {
        return [];
      }
      return await Task.find(query);
    },
  },
};

export default resolvers;
