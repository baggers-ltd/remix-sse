import type { MetaFunction } from '@remix-run/node';
import {
  useEventSource,
  useSubscribe
} from '@remix-sse/client';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  // This can be called from anywhere in your react tree- even a parent component
  useEventSource('/basic');

  const greetings = useSubscribe('/basic', 'greeting');
  const questions = useSubscribe('/basic', 'question');

  const mostRecentGreeting = useSubscribe('/basic', 'greeting', {
    returnLatestOnly: true,
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Remix-SSE</h1>

      <h2>Greetings:</h2>
      {JSON.stringify(greetings)}

      <h2>Questions:</h2>
      {JSON.stringify(questions)}

      <h2>Most Recent Greeting:</h2>
      {JSON.stringify(mostRecentGreeting)}
    </div>
  );
}