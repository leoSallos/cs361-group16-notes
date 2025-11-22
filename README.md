This is the repo for the sprint 3 notes panel service.

# Communication Contract

### Requests

`GET /`
- no body

`GET /list/<userID>`
- no body

`GET /get/<userID>/<noteID>`
- no body

`POST /new/<userID>`
- body must be in the following format:
```
{
    title: <title of note>,
    created: <date created in UNIX time>,
    updated: <date last updated in UNIX time>,
    textContent: <content of the note>
}
```

`POST /update/<userID>/<noteID>`
- body must be in the following format:
```
{
    title: <title of note>,
    updated: <date last updated in UNIX time>,
    textContent: <content of the note>
}
```

### Responses

`GET /`

`GET /list/<userID>`

`GET /get/<userID>/<noteID>`

`POST /new/<userID>`

`POST /update/<userID/<update>`
