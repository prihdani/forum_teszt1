import { useFormik } from 'formik';
import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast, Stack, FormErrorMessage, Center, Card, CardBody } from '@chakra-ui/react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

interface ValuesforForm {
  username: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
}

const validationSchema = Yup.object({
  username: Yup.string().email('Érvényes email címet kell megadni').required('Kötelező mező'),
  password: Yup.string().min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie,1 számmal és 1 kisbetűvel')
    .matches(/[0-9]/, 'Tartalmazzon legalább 1 számot')
    .matches(/[a-z]/, 'Tartalmazzon legalább 1 kisbetűt')
    .required('Kötelező mező'),
  passwordConfirm: Yup.string().oneOf([Yup.ref('password'), ''], 'A jelszó nem egyezik')
    .required('Kötelező mező'),
  firstName: Yup.string().required('Kötelező mező'),
  lastName: Yup.string().required('Kötelező mező'),
});

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const formik = useFormik<ValuesforForm>({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
      lastName: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const response = await fetch('http://localhost:5000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const userData = await response.json();

          localStorage.setItem('userData', JSON.stringify(userData));

          toast({
            title: 'Sikeres regisztráció!',
            description: 'Most már bejelentkezhet.',
            status: 'success',
            duration: 2000,
          });
          resetForm();
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if (response.status === 400) {
          toast({
            title: 'Hiba',
            description: 'A bevitt adatok érvénytelenek.',
            status: 'error',
            duration: 2000,
          });
        } else if (response.status === 409) {
          toast({
            title: 'Hiba',
            description: 'A felhasználó már létezik.',
            status: 'error',
            duration: 2000,
          });
        }
      } catch (error) {
        console.error('Regisztráció hiba:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box>
      <Center>
        <Stack spacing='4'>
          <VStack as='header' spacing='6' mt='8'>
            <Heading as='h1' fontWeight='300' fontSize='24px'>
              Regisztráció
            </Heading>
          </VStack>
          <Card bg='whitesmoke' variant='outline' borderColor='black' w='350px'>
            <CardBody>
              <Box as="form" onSubmit={formik.handleSubmit}>
                <Stack spacing='5'>
                  <FormControl id="firstName" isInvalid={formik.touched.firstName && !!formik.errors.firstName} isRequired>
                    <FormLabel size='sm'>Keresztnév</FormLabel>
                    <Input
                      type="text" name="firstName" bg='white' borderColor='black' size='sm' borderRadius='10px' value={formik.values.firstName}
                      onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    {formik.touched.firstName && formik.errors.firstName && (
                      <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl id="lastName" isInvalid={formik.touched.lastName && !!formik.errors.lastName} isRequired>
                    <FormLabel size='sm'>Vezetéknév</FormLabel>
                    <Input type="text" name="lastName" bg='white' borderColor='black' size='sm' borderRadius='10px' 
                    value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    {formik.touched.lastName && formik.errors.lastName && (
                      <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl id="username" isInvalid={formik.touched.username && !!formik.errors.username} isRequired>
                    <FormLabel size='sm'>Email cím</FormLabel>
                    <Input type="email" name="username" bg='white' borderColor='black' size='sm' borderRadius='10px' 
                    value={formik.values.username} onChange
                    ={formik.handleChange} onBlur={formik.handleBlur}/>
                    {formik.touched.username && formik.errors.username && (
                      <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl id="password" isInvalid={formik.touched.password && !!formik.errors.password} isRequired>
                    <FormLabel size='sm'>Jelszó</FormLabel>
                    <Input type="password" name="password" bg='white' borderColor='black' size='sm' borderRadius='10px' 
                    value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    {formik.touched.password && formik.errors.password && (
                      <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl id="passwordConfirm" isInvalid={formik.touched.passwordConfirm && !!formik.errors.passwordConfirm} isRequired>
                    <FormLabel size='sm'>Jelszó megerősítése</FormLabel>
                    <Input type="password" name="passwordConfirm" bg='white' borderColor='black' size='sm' borderRadius='10px' 
                    value={formik.values.passwordConfirm} onChange={formik.handleChange} onBlur={formik.handleBlur}/>
                    {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
                      <FormErrorMessage>{formik.errors.passwordConfirm}</FormErrorMessage>
                    )}
                  </FormControl>
                  <Button colorScheme="blue" mt="5" type="submit" isLoading={formik.isSubmitting}
                  bg='black' color='white' size='sm'>
                    Regisztráció
                  </Button>
                  <Button variant="outline" mt="5" ml="5" onClick={() => formik.resetForm()} size='sm'>
                    Mégsem
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

export default RegisterForm;
