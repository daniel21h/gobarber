/* eslint-disable react/jsx-curly-newline */
import React, { useState, useCallback, useEffect, useMemo } from 'react';

import { format } from 'date-fns';
import { useRecoilValue, useRecoilState } from 'recoil';

import {
  Container,
  ContentCreateAppointment,
  TypeButton,
  TypeText,
  Section,
  SectionBeard,
  ContentMorning,
  ContentAfternoon,
  HourButton,
  HourText,
  CreateButton,
} from './styles';

import { useToast } from '../../../hooks/toast';
import api from '../../../services/api';
import {
  selectedProviderState,
  selectedDateState,
  availabilityState,
  selectedBeardHourState,
  selectedHairHourState,
} from '../../../atoms/index';

const Beard: React.FC = () => {
  const selectedProvider = useRecoilValue(selectedProviderState);
  const selectedDate = useRecoilValue(selectedDateState);
  const availability = useRecoilValue(availabilityState);
  const selectedHairHour = useRecoilValue(selectedHairHourState);
  const selectedBeardHour = useRecoilValue(selectedBeardHourState);

  const [editSelectedBeardHour, setEditSelectedBeardHour] = useRecoilState(
    selectedBeardHourState,
  );

  const [selectedBeard, setSelectedBeard] = useState('');
  const [dateBeard, setDateBeard] = useState(new Date());

  const { addToast } = useToast();

  const handleSelectBeardHour = useCallback(
    (hour: any, available: boolean) => {
      const thirtyHourPAR = hour.slice(3);

      if (available === true && hour !== selectedHairHour) {
        if (thirtyHourPAR === '00' || thirtyHourPAR === '30') {
          setEditSelectedBeardHour(hour);
        }

        if (hour === selectedBeardHour) {
          setEditSelectedBeardHour('50');
        }
      }
    },
    [selectedBeardHour, setEditSelectedBeardHour, selectedHairHour],
  );

  const handleSelectBeard = useCallback(() => {
    if (selectedBeard === '') {
      setSelectedBeard('Barba');
    } else if (selectedBeard === 'Barba') {
      setSelectedBeard('');
    }
  }, [selectedBeard]);

  useEffect(() => {
    const date = new Date(selectedDate);

    const arrayBeard = [];
    arrayBeard.push(selectedBeardHour);

    const fullBeardHour: any = arrayBeard.toString().slice(0, 2);
    const halfBeardHour: any = arrayBeard.toString().slice(3);

    if (halfBeardHour === '00') {
      date.setHours(fullBeardHour);
      date.setMinutes(0);

      setDateBeard(date);
    } else if (halfBeardHour === '30') {
      date.setHours(fullBeardHour);
      date.setMinutes(30);

      setDateBeard(date);
    } else if (selectedBeardHour === '50') {
      setDateBeard(new Date());
    }
  }, [selectedDate, selectedBeardHour]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          fullHourFormatted: format(new Date().setHours(hour), 'HH:00'),
          halfHourFormatted: format(new Date().setHours(hour), 'HH:30'),
        };
      });
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          fullHourFormatted: format(new Date().setHours(hour), 'HH:00'),
          halfHourFormatted: format(new Date().setHours(hour), 'HH:30'),
        };
      });
  }, [availability]);

  const handleCreateAppointment = useCallback(async () => {
    try {
      await api.post('appointments', {
        provider_id: selectedProvider.toString(),
        date: dateBeard,
        type: selectedBeard,
      });

      addToast({
        type: 'success',
        title: 'Agendamento criado.',
        description: 'Serviço de barba agendadado com sucesso!',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Erro na criação do agendamento',
        description: 'Selecione o serviço/horário',
      });
    }
  }, [addToast, dateBeard, selectedBeard, selectedProvider]);

  return (
    <Container>
      <ContentCreateAppointment>
        <Section>
          <SectionBeard>
            <TypeButton
              selectedBeard={selectedBeard === 'Barba'}
              onClick={handleSelectBeard}
            >
              <TypeText selected={selectedBeard === 'Barba'}>Barba</TypeText>
            </TypeButton>

            <strong>Manhã</strong>
            {morningAvailability.map(
              ({ fullHourFormatted, halfHourFormatted, available }) => (
                <ContentMorning>
                  <HourButton
                    style={{ marginLeft: 16 }}
                    enabled={available}
                    selectedBeard={selectedBeardHour === fullHourFormatted}
                    available={available}
                    key={fullHourFormatted}
                    onClick={() =>
                      handleSelectBeardHour(fullHourFormatted, available)
                    }
                  >
                    <HourText
                      selected={selectedBeardHour === fullHourFormatted}
                    >
                      {fullHourFormatted}{' '}
                    </HourText>
                  </HourButton>

                  <HourButton
                    enabled={available}
                    selectedBeard={selectedBeardHour === halfHourFormatted}
                    available={available}
                    key={halfHourFormatted}
                    onClick={() =>
                      handleSelectBeardHour(halfHourFormatted, available)
                    }
                  >
                    <HourText
                      selected={selectedBeardHour === halfHourFormatted}
                    >
                      {halfHourFormatted}{' '}
                    </HourText>
                  </HourButton>
                </ContentMorning>
              ),
            )}

            <strong>Tarde</strong>
            {afternoonAvailability.map(
              ({ fullHourFormatted, halfHourFormatted, available }) => (
                <ContentAfternoon>
                  <HourButton
                    style={{ marginLeft: 16 }}
                    enabled={available}
                    selectedBeard={selectedBeardHour === fullHourFormatted}
                    available={available}
                    key={fullHourFormatted}
                    onClick={() =>
                      handleSelectBeardHour(fullHourFormatted, available)
                    }
                  >
                    <HourText
                      selected={selectedBeardHour === fullHourFormatted}
                    >
                      {fullHourFormatted}{' '}
                    </HourText>
                  </HourButton>

                  <HourButton
                    enabled={available}
                    selectedBeard={selectedBeardHour === halfHourFormatted}
                    available={available}
                    key={halfHourFormatted}
                    onClick={() =>
                      handleSelectBeardHour(halfHourFormatted, available)
                    }
                  >
                    <HourText
                      selected={selectedBeardHour === halfHourFormatted}
                    >
                      {halfHourFormatted}{' '}
                    </HourText>
                  </HourButton>
                </ContentAfternoon>
              ),
            )}
          </SectionBeard>
        </Section>
        <CreateButton
          style={{ marginTop: 50 }}
          onClick={handleCreateAppointment}
        >
          Criar agendamento
        </CreateButton>
      </ContentCreateAppointment>
    </Container>
  );
};

export default Beard;
