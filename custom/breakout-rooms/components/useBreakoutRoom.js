import React, { useCallback, useEffect, useState } from 'react';
import { useCallState } from '@custom/shared/contexts/CallProvider';
import { useParticipants } from '@custom/shared/contexts/ParticipantsProvider';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers';
import { supabase } from '../utils/supabase';

const groupBy = (items, key) => items.reduce(
  (result, item) => ({
    ...result,
    [item[key]]: [
      ...(result[item[key]] || []),
      item,
    ],
  }),
  {},
);

const useBreakoutRoom = () => {
  const { callObject } = useCallState();
  const { participants, localParticipant } = useParticipants();

  const handleTrackSubscriptions = useCallback((breakoutRooms) => {
    Object.values(breakoutRooms || []).map(room => {
      const updateList = [];
      const isLocalUserInRoom =
        room.filter(r => r.participant_id === localParticipant.user_id).length > 0;
      if (isLocalUserInRoom) {
        callObject.setSubscribeToTracksAutomatically(false);
        room.map(p => updateList[p.participant_id] = { setSubscribedTracks: true });
        callObject.updateParticipants(updateList);
      }
    })
  }, [callObject, localParticipant.user_id]);

  const handleAppMessage = useCallback((e) => {
    if (e?.data?.message?.type === 'breakout-rooms') {
      handleTrackSubscriptions(e?.data?.message?.value);
    }
  }, [handleTrackSubscriptions]);

  useEffect(() => {
    if (!callObject) return;

    callObject.on('app-message', handleAppMessage);
    return () => callObject.off('app-message', handleAppMessage);
  }, [callObject, handleAppMessage]);

  useEffect(handleTrackSubscriptions, [handleTrackSubscriptions]);

  const create = async () => {
    if (participants.length < 4)
      return new Error('Can not create breakout room with less than 4 members');
    else {
      let n = participants.length / 2;
      if (participants.length > 10) n = 5

      const rooms = [];
      new Array(Math.ceil(participants.length / n))
        .fill()
        .map(_ => rooms.push({ session_id: uuid(), members: participants.splice(0, n)}));

      const participantsList = [];
      rooms.map(r =>
        r.members.map(p => participantsList.push({ participant_id: p.user_id, session_id: r.session_id })));

      const { data } = await supabase
        .from('participants')
        .insert(participantsList);

      callObject.sendAppMessage({
        message: {
          type: 'breakout-rooms',
          value: groupBy(data, 'session_id')
        }
      }, '*');

      handleTrackSubscriptions(groupBy(data, 'session_id'));
    }
  };

  return { create };
};

export default useBreakoutRoom;