import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Documentación de la API
          </h1>
          <p className='mt-2 text-gray-600'>
            Documentación completa de todos los endpoints de la API REST
          </p>
        </div>
        <SwaggerUI url='/api/docs' />
      </div>
    </div>
  );
}
