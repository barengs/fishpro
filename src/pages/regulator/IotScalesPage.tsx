import { AlertBanner } from "../../components/ui";
import { useIotScales } from "./scales/hooks/useIotScales";
import { ScaleHeader } from "./scales/components/ScaleHeader";
import { ScaleDisplay } from "./scales/components/ScaleDisplay";
import { IotSimulator } from "./scales/components/IotSimulator";
import { ScaleCatchForm } from "./scales/components/ScaleCatchForm";
import { ScaleReadingsTable } from "./scales/components/ScaleReadingsTable";

export function IotScalesPage() {
  const {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    latestReading,
    readings,
    loading,
    sseConnected,
    fetchReadings,

    // Form fields
    ships,
    speciesList,
    areas,
    selectedShipReg,
    setSelectedShipReg,
    selectedSpeciesId,
    setSelectedSpeciesId,
    selectedWppId,
    setSelectedWppId,
    catchType,
    setCatchType,
    catchDate,
    setCatchDate,
    operatorNotes,
    setOperatorNotes,

    saving,
    saveSuccess,
    errorMsg,
    setErrorMsg,
    handleSaveCatch,

    // Simulator
    simWeight,
    setSimWeight,
    simulating,
    showSimulator,
    setShowSimulator,
    handleSimulateWeight,
  } = useIotScales();

  const currentWeightNum = latestReading
    ? Number(latestReading.weight).toFixed(2)
    : "0.00";

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Toolbar & Device Selector Bar */}
      <ScaleHeader
        devices={devices}
        selectedDeviceId={selectedDeviceId}
        onDeviceChange={setSelectedDeviceId}
        sseConnected={sseConnected}
        onRefresh={() => fetchReadings(selectedDeviceId)}
      />

      {errorMsg && (
        <AlertBanner
          variant="error"
          message={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />
      )}

      {/* 2. Main Live Scale Terminal + Catch Linking Form (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Digital Display + Testing Simulator */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <ScaleDisplay
            selectedDeviceId={selectedDeviceId}
            latestReading={latestReading}
            loading={loading}
          />

          <IotSimulator
            showSimulator={showSimulator}
            onToggle={() => setShowSimulator(!showSimulator)}
            simWeight={simWeight}
            onWeightChange={setSimWeight}
            simulating={simulating}
            onSubmit={handleSimulateWeight}
          />
        </div>

        {/* Right Column: Save Catch Form & Blockchain Seal */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <ScaleCatchForm
            latestReading={latestReading}
            currentWeightNum={currentWeightNum}
            ships={ships}
            speciesList={speciesList}
            areas={areas}
            selectedShipReg={selectedShipReg}
            onShipChange={setSelectedShipReg}
            selectedSpeciesId={selectedSpeciesId}
            onSpeciesChange={setSelectedSpeciesId}
            selectedWppId={selectedWppId}
            onWppChange={setSelectedWppId}
            catchType={catchType}
            onCatchTypeChange={setCatchType}
            catchDate={catchDate}
            onCatchDateChange={setCatchDate}
            operatorNotes={operatorNotes}
            onNotesChange={setOperatorNotes}
            saving={saving}
            saveSuccess={saveSuccess}
            onSubmit={handleSaveCatch}
          />
        </div>
      </div>

      {/* 3. Scale Readings Log Table */}
      <ScaleReadingsTable
        readings={readings}
        loading={loading}
        onRefresh={() => fetchReadings(selectedDeviceId)}
      />
    </div>
  );
}
