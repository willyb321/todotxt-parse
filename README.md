# todotxt-parse
> Parse todo.txt strings easily.

## Usage

```javascript
// Install
// npm i todotxt-parse

const TodoTxt = require('todotxt-parse').default;

const txt = `x 2011-03-02 2011-03-01 Review Tim's pull request +TodoTxtTouch @github`;

const todo = new TodoTxt(txt);

console.log(todo.parse());
// Logs
// { origText: 'x 2011-03-02 2011-03-01 Review Tim\'s pull request +TodoTxtTouch @github',
//   text:
//    [ 'x',
//      '2011-03-02',
//      '2011-03-01',
//      'Review',
//      'Tim\'s',
//      'pull',
//      'request',
//      '+TodoTxtTouch',
//      '@github' ],
//   complete: true,
//   priority: null,
//   creationDate: '2011-03-01',
//   completionDate: '2011-03-02',
//   projects: [ '+TodoTxtTouch' ],
//   contexts: [ '@github' ] }
```
