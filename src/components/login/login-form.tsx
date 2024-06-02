import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {Box,Button,FormControl,FormLabel,Input,Alert,AlertIcon,FormErrorMessage,Heading,Center,Stack,VStack,Card,CardBody,HStack} from '@chakra-ui/react';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validationForLogin = Yup.object({
    username: Yup.string()
      .email('Érvénytelen email cím')
      .required('Kötelező mező'),
    password: Yup.string()
      .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie, 1 számmal és 1 kisbetűvel')
      .matches(/\d/, 'A jelszónak tartalmaznia kell legalább egy számot')
      .matches(/[a-z]/, 'A jelszónak tartalmaznia kell legalább egy kisbetűt')
      .required('Kötelező mező'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationForLogin,
    onSubmit: async (values) => {
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('accessToken', data.accessToken);
          navigate('/profile');
        } else if (response.status === 400) {
          setError('Hibás adatok');
        } else if (response.status === 401) {
          setError('Hibás felhasználónév vagy jelszó');
        }
      } catch (error) {
        console.error('Hálózati hiba:', error);
        setError('Hálózati hiba');
      }
    },
  });

  return (
    <Box>
      <Center>
        <Stack spacing='4'>
          <VStack as='header' spacing='6' mt='8'>
            <Heading as='h1' fontWeight='300' fontSize='24px'>
              Bejelentkezés
            </Heading>
          </VStack>
          <Card bg='whitesmoke' variant='outline' borderColor='black' w='350px'>
            <CardBody>
              <Box as='form' onSubmit={formik.handleSubmit}>
                <Stack spacing='5'>
                  <FormControl isInvalid={formik.touched.username && !!formik.errors.username} isRequired>
                    <FormLabel size='sm'>E-mail cím</FormLabel>
                    <Input type='email' name='username' bg='white' borderColor='#black' size='sm' borderRadius='10px'value={formik.values.username}
                    onChange={formik.handleChange}onBlur={formik.handleBlur}/>
                    {formik.touched.username && formik.errors.username && (
                      <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                    )} </FormControl>
                  <FormControl isInvalid={formik.touched.password && !!formik.errors.password} isRequired>
                    <HStack justify='space-between'>
                      <FormLabel size='sm'>Jelszó</FormLabel>
                    </HStack>
                    <Input type='password' bg='white' borderColor='black' size='sm' borderRadius='10px' name="password"
                    value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    {formik.touched.password && formik.errors.password && (
                      <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                    )}
                  </FormControl>
                  {error && (
                    <Alert status="error" mt="1">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}
                  <Button colorScheme='black' isDisabled={formik.isSubmitting || !formik.isValid} type='submit' bg='black' color='white' size='sm'>
                    Bejelentkezés
                  </Button>
                </Stack>
              </Box>
            </CardBody>
          </Card>
        </Stack>
      </Center>
    </Box>
  );
};

export default LoginPage;