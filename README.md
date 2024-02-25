# `remix-sse`

Server Side Events (SSE) for Remix, made easy.


## Features

- ✅ Zero-dependencies
- ✅ Small bundle
- ✅ Context for re-using event source connections across remix application
- ✅ supports multiple event types from a single emitter
- ✅ 100% typescript
- ✅ (experimental) Typed deserialization

### Planned

- 👷 Topic support - pass a topic string to `useSubscribe` and only listen to events that match the topic
- 👷 Emitter type support - ensures the messages you are sending are in a format your hooks are expecting

# Installation

```sh
npm i @remix-sse/client @remix-sse/server
```

# Documentation

See [examples](/examples/) directory.

# Quick Start

See [basic example](/examples/basic/README.md) for more detail.


### Server
1. Setup your event source route, here it is called `/routes/emitter.tsx` for simplicity

> Note: This **MUST** be a resource route, you cannot return a component from this route.

```.ts
import { EventStream } from '@remix-sse/server'
export const loader: LoaderFunction = ({ request }) => {

  // Return the EventStream from your route loader
  return new EventStream(request, (send) => {
    // In the init function, setup your SSE Event source
    // This can be any asynchronous data source, that will send
    // events to the client periodically

    // Here we will just use a `setInterval`

    const interval = setInterval(() => {
      // You can send events to the client via the `send` function
      send(JSON.stringify({ hello: 'world'}))

      // if you to send different events on multiple channels you can
      // specify an eventKey in the options
      send(JSON.stringify({ hello: 'world'}), { eventKey: 'channelExample'})

    }, 1000)


    return () => {
      // Return a cleanup function
      clearInterval(interval)
    };
  });
};
```

### Client

1. Wrap your `root.tsx` with `RemixSseProvider`.

```.ts

import { RemixSseProvider} from '@remix-sse/client'


<RemixSseProvider>
  <Outlet />
</RemixSseProvider>
```

2. Call the `useEventSource` to setup an `EventSource` in your browser

```.ts
import { useEventSource } from '@remix-sse/client'
useEventSource('/emitter');

```

3. Call `useSubscribe` from anywhere in your tree to begin listening to events emitted from the event source

```.ts
// This value is a react state object, and will change everytime
// an event is emitted

// By default this is a string[]
const greeting = useSubscribe('/emitter')

// But you can return only the latest event as follows
const latestGreeting = useSubscribe('/emitter', {
  returnLatestOnly: true
})

// Or you can type the return by deserializing the event data
const typedGreeting = useSubscribe('/emitter', {
  returnLatestOnly: true,
  deserialize: (raw) => JSON.parse(raw) as Greeting
})

```

# Deserialize

By default the `data` returned from `useSubscribe` is a `string[]`

You can pass a `deserialize` function to de-deserialize each event as it comes in.

> Note: this feature is experimental and is subject to change.

See [deserialize](/examples/deserialize/) for more details.

## `useSubscribe` options

| Option              | Description                                                                               | Default |
| ------------------- | ----------------------------------------------------------------------------------------- | ------- |
| `eventKey`  | The name of the event, use this if you wish to send multiple types of event from the same emitter |'message'|
| `maxEventRetention` | The maximum number of events that will be kept.                                           | 50      |
| `returnLatestOnly`  | Returns only the most recently emitted event - ie. returns `TEvent` instead of `TEvent[]` | `false` |

## Experimental options

These are currently being tested, and are subject to change at any point.

| Option        | Description                                                                                                                        | Default   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `deserialize` | A function that will receive the raw event data and returns a deserialized value. See [deserialize example](/examples/deserialize) | undefined |

.
