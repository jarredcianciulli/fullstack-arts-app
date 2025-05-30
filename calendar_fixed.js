            <Calendar
              isOpen={isCalendarOpen}
              handleClose={() => {
                setIsCalendarOpen(false);
                setEditingSessionIndex(null);
              }}
              onSelect={
                editingSessionIndex !== null
                  ? handleCalendarEditSelect
                  : handleCalendarSelect
              }
              availability_organization={field.availableOrganizations || 1}
              initialTime={editingSessionIndex !== null ? selectedSessions[editingSessionIndex]?.time : null}
            />
