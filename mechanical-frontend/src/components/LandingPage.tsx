import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Build as BuildIcon,
  Speed as SpeedIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <BuildIcon sx={{ fontSize: 48, color: '#42628C' }} />,
      title: 'Mantenimiento Preventivo',
      description: 'Servicio completo de mantenimiento para mantener tu vehículo en óptimas condiciones.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48, color: '#42628C' }} />,
      title: 'Reparación de Frenos',
      description: 'Sistema de frenos seguro y confiable para tu tranquilidad en la carretera.',
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 48, color: '#42628C' }} />,
      title: 'Diagnóstico Electrónico',
      description: 'Tecnología avanzada para detectar problemas mecánicos con precisión.',
    },
  ];

  const testimonials = [
    {
      name: 'Carlos Rodríguez',
      role: 'Cliente Regular',
      content: 'Excelente servicio y atención. Siempre resuelven mis problemas mecánicos con profesionalismo.',
      rating: 5,
    },
    {
      name: 'María González',
      role: 'Empresaria',
      content: 'La precisión y rapidez en el diagnóstico me han sorprendido. Muy recomendables.',
      rating: 5,
    },
    {
      name: 'Juan Pérez',
      role: 'Conductor Profesional',
      content: 'Servicio confiable y precios justos. Mi taller de confianza desde hace años.',
      rating: 5,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F2F2F2' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1A2A40 0%, #253C59 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2342628C" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 3,
                  background: 'linear-gradient(45deg, #FFFFFF 30%, #E2E8F0 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Taller Automotriz Pro
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: '#E2E8F0',
                  fontWeight: 300,
                  lineHeight: 1.6,
                }}
              >
                Servicio profesional de mantenimiento y reparación automotriz.
                Tecnología avanzada y mecánicos certificados para tu tranquilidad.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    backgroundColor: '#42628C',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: '#253C59',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(66, 98, 140, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <PhoneIcon sx={{ mr: 1 }} />
                  Solicitar Cita
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    borderColor: '#42628C',
                    color: '#42628C',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: '#42628C',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(66, 98, 140, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Acceder al Sistema
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 400,
                  background: 'linear-gradient(135deg, #42628C 0%, #253C59 100%)',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '"🏁"',
                    fontSize: '8rem',
                    opacity: 0.1,
                    position: 'absolute',
                  },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    textAlign: 'center',
                    zIndex: 1,
                  }}
                >
                  Tecnología<br />Avanzada
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 2,
            color: '#1A2A40',
            fontWeight: 700,
          }}
        >
          Nuestros Servicios
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            mb: 8,
            color: '#42628C',
            fontWeight: 300,
          }}
        >
          Soluciones completas para el mantenimiento de tu vehículo
        </Typography>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 35px rgba(26, 42, 64, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    {service.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      mb: 2,
                      color: '#1A2A40',
                      fontWeight: 600,
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#0D0D0D',
                      lineHeight: 1.6,
                    }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ backgroundColor: '#253C59', py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 2,
              color: 'white',
              fontWeight: 700,
            }}
          >
            Lo que dicen nuestros clientes
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 8,
              color: '#E2E8F0',
              fontWeight: 300,
            }}
          >
            La satisfacción de nuestros clientes es nuestra mayor recompensa
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 3,
                    p: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                      ))}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        color: '#0D0D0D',
                        fontStyle: 'italic',
                        lineHeight: 1.6,
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: '#42628C',
                          width: 40,
                          height: 40,
                          mr: 2,
                        }}
                      >
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: '#1A2A40',
                          }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#42628C',
                          }}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: '#F2F2F2', py: 10 }}>
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1A2A40 0%, #253C59 100%)',
              borderRadius: 4,
              p: 6,
              color: 'white',
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                mb: 3,
                fontWeight: 700,
              }}
            >
              ¿Listo para el mejor servicio automotriz?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: '#E2E8F0',
                fontWeight: 300,
              }}
            >
              Agenda tu cita hoy mismo y experimenta la diferencia de un servicio profesional.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{
                backgroundColor: '#42628C',
                color: 'white',
                px: 6,
                py: 2,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1.2rem',
                '&:hover': {
                  backgroundColor: '#253C59',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 30px rgba(66, 98, 140, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <PhoneIcon sx={{ mr: 1 }} />
              Solicitar Cita Ahora
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;