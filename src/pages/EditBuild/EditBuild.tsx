import { FC, useMemo } from 'react';
import { useParams } from 'react-router';
import useBuildSaves from '../../hooks/useBuildSaves';
import CreateBuild from '../BuildSelector/CreateBuild';

const EditBuild: FC = () => {
  const { buildId } = useParams<{ buildId: string }>();
  const [buildSaves] = useBuildSaves();

  const build = useMemo(
    () => buildSaves.find((save) => save.build.id === buildId)?.build,
    [buildSaves, buildId]
  );

  return <CreateBuild initialValues={build} />;
};

export default EditBuild;
