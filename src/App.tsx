import { useApp } from './store';
import { Splash } from './screens/Splash';
import { CategoryScreen } from './screens/CategoryScreen';
import { ScenarioScreen } from './screens/ScenarioScreen';
import { Generating } from './screens/Generating';
import { Result } from './screens/Result';
import { Share } from './screens/Share';

export default function App() {
  const step = useApp((s) => s.step);
  return (
    <main className="app">
      {step === 'splash' && <Splash />}
      {step === 'category' && <CategoryScreen />}
      {step === 'scenario' && <ScenarioScreen />}
      {step === 'generating' && <Generating />}
      {step === 'result' && <Result />}
      {step === 'share' && <Share />}
    </main>
  );
}
