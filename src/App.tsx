import Leveler from './pages/Leveler';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BuildList from './pages/BuildSelector/BuildList';
import ImportBuild from './pages/BuildSelector/ImportBuild';
import CreateBuild from './pages/BuildSelector/CreateBuild';
import EditBuild from './pages/EditBuild';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<BuildList />} />
        <Route path="/import" element={<ImportBuild />} />
        <Route path="/create" element={<CreateBuild />} />
        <Route path="/builds/:buildId/edit" element={<EditBuild />} />
        <Route path="/builds/:buildId" element={<Leveler />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
