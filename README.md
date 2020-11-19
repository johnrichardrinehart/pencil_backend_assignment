# pencil_backend_assignment
A repository hosting code for Pencil's backend take home assignment

## Notes
1. The problem specifies to load data from Google Sheets into a Mongo database. It doesn't specify if I should use an API to grab the document and parse it, then load it into the database over the network or if I should parse a locally-downloaded (offline) copy. So, I'll implement it first using the local way. Once the parsing works and the database is loaded I'll implement the online (Google Sheet's API) method using some library.
1. The queried topic specifies the root of the topic subtree, each node of which has associated questions considered in the return. Thus, having a tree structure in the database will be absolutely crucial. Note that this is a k-ary tree. For each topic in the subtree we need to set of questions (a set `union` in math-speak). Though not required, for testing purposes it would be great to have this be ordered. I'll add an optional query parameter (`&ordered=<true|false>`) which take the resultant set and sort in `log(n)` time.
1. For each topic in the tree we need the array of questions associated with it.
1. We will be iterating through questions, and appending each question to the `question` array of a given topic. So, it's crucial that we index the topics.
1. Initial proposed schema for topics: 
      
        {
            "topic": `some special topic string`, // indexed!
            questions: [1,5,8,21,58,101],
            subtopics: [`special subtopic 1`, `special subtopic 2`, ...],
        }