import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, FormControl, FormLabel, Heading, Input, Stack, Center, Box, CardBody, Card, VStack} from '@chakra-ui/react';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
}

const UserPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await fetch('http://localhost:5000/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('accessToken');
            navigate('/login');
            return;
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: UserData = await response.json();
        setUserData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred.');
        }
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <Box>
      <Center>
        <Stack spacing='4'>
          <VStack as='header' spacing='6' mt='8'>
            <Heading as='h1' fontWeight='300' fontSize='24px'>
              Profil
            </Heading>
          </VStack>
          <Card bg='whitesmoke' variant='outline' borderColor='black' w='350px'>
            <CardBody>
              {userData && (
                <Box>
                  <FormControl id="lastName" isRequired mt="4">
                    <FormLabel size='sm'>Vezetéknév</FormLabel>
                    <Input placeholder="Last Name" _placeholder={{ color: 'gray.500' }} type="text" bg='white' borderColor='black' 
                     size='sm' borderRadius='10px' value={userData.lastName} readOnly/>
                  </FormControl>
                  <FormControl id="firstName" isRequired mt="4">
                    <FormLabel size='sm'>Keresztnév</FormLabel>
                    <Input placeholder="First Name" _placeholder={{ color: 'gray.500' }} type="text" bg='white' borderColor='black'
                     size='sm' borderRadius='10px'value={userData.firstName}readOnly/>
                  </FormControl>
                  <FormControl id="email" isRequired mt="4">
                    <FormLabel size='sm'>E-mail cím</FormLabel>
                    <Input
                      placeholder="your-email@example.com"
                      _placeholder={{ color: 'gray.500' }}
                      type="email"
                      bg='white'
                      borderColor='black'
                      size='sm'
                      borderRadius='10px'
                      value={userData.email}
                      readOnly
                    />
                  </FormControl>
                  <Button colorScheme="red" mt="4" w="full" bg='black' color='white' size='sm' onClick={handleLogout}>Kilépés</Button>
                </Box>
              )}
            </CardBody>
          </Card>
        </Stack>
      </Center>
    </Box>
  );
  
};

export default UserPage;