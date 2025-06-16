import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto py-8 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Dobrodošli!
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Jednostavna aplikacija za upravljanje članovima
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Registracija</h3>
            <p className="text-gray-600">Kreirajte novi korisnički račun</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Upravljanje profilom</h3>
            <p className="text-gray-600">Uredite svoje korisničke podatke</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Admin panel</h3>
            <p className="text-gray-600">Upravljanje svim korisnicima (samo admin)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 