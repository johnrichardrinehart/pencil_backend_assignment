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
1. I'm starting to parse the `Topics` table. It's structure will be important for querying performance. Notably, I don't think Mongo has support for nested indices. So, a naive tree-like scheme would be a bad one for the `topics` db.

        {
        "1a": [
            {
            "1a->2a": [
                "1a->2a->3a",
                "1a->2a->3b"
            ]
            },
            {
            "1a->2b": [
                "1a->2b->3a",
                "2a->2b->3b"
            ]
            }
        ],
        "1b": [
            {
            "1b->2a": [
                "1b->2a->3a"
            ]
            },
            {
            "1b->2b": [
                "1b->2b->3a"
            ]
            }
        ]
        }

A much better structure works like a fan-out linked list, where each level is asssociated with an array of sub-levels, and so on:

    {
    {
        "1a":[
            "1a->2a",
            "1a->2b"
        ]
    },
    {
        "1b":[
            "1b->2a",
            "1b->2b"
        ]
    },
    {
        "1a->2a":[
            "1a->2a->3a",
            "1a->2a->3b"
        ]
    },
    {
        "1a->2b":[
            "1a->2b->3a",
            "2a->2b->3b"
        ]
    },
    {
        "1b->2a":[
            "1b->2a->3a"
        ]
    },
    {
        "1b->2b":[
            "1b->2b->3a"
        ]
    }
    ]

There's a slight increase in storage space because now we're repeating the topic name at least twice. One to indicate which parent/s owns/own it, and another to indicate what its children are. But, compression should take care of that. Also, we could always have a lookup table from topic-name:topic-id, where each new topic receives a new unique identifier (`incrementing integer`).

So, this is the data structure/schema we'll use for the `topics` database. Then, when someone queries for a particular question, we can easily follow the subtree to obtain all other questions. The questions will be stored in this database in a simple way. As we go through the list of all questions to build our database, we'll identify which topic that question is associated with. Then, we'll append that question number to the `questions` array of the associated topic. So, the final schema, including this, looks like:

        {
        "1a":{
            "children":[
                "1a->2a",
                "1a->2b"
            ],
            "questions":[
                1,
                10,
                24,
                52
            ]
        },
        "1b":{
            "children":[
                "1b->2a",
                "1b->2b"
            ],
            "questions":[
                5,
                20,
                72,
                96
            ]
        },
        "1a->2a":{
            "children":[
                "1a->2a->3a",
                "1a->2a->3b"
            ],
            "questions":[
                2,
                18,
                50,
                80
            ]
        },
        "1a->2b":{
            "children":[
                "1a->2b->3a",
                "2a->2b->3b"
            ],
            "questions":[
                12,
                17,
                21,
                60
            ]
        },
        "1b->2a":{
            "children":[
                "1b->2a->3a"
            ],
            "questions":[
                52,
                55
            ]
        },
        "1b->2b":{
            "children":[
                "1b->2b->3a"
            ],
            "questions":[
                13,
                19,
                22
            ]
        }
        }

So, the order of operations will be to build the `topics` database and then generate the questions array based on the "tree" in that table.