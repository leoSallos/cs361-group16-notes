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

Response body format:

`GET /`
- `204`: Status if there is a successful ping, no body.

`GET /list/<userID>`
- `404`: User data not found, no body.
- `204`: User found, but has no data, no body.
- `200`: Sends back body content in the following format:
```
{
    notes: [
        {
            id: <noteID>,
            title: <title of note>,
            updated: <date last updated in UNIX time>
        }
    ]
}
```

`GET /get/<userID>/<noteID>`
- `404`: Requested note or user data not found, no body.
- `200`: Sends back body content in the following format:
```
{
    title: <title of note>,
    created: <date created in UNIX time>,
    updated: <date last updated in UNIX time>,
    textContent: <content of the note>
}
```

`POST /new/<userID>`
- `400`: Improper request body format, no body.
- `500`: Server error when saving data, no body.
- `200`: Success, no body.

`POST /update/<userID>/<noteID>`
- `400`: Improper request body format, no body.
- `404`: No user not note data found, no body.
- `500`: Server error when saving data, no body.
- `200`: Success, no body.
