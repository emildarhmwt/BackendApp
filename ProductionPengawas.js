import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Text,
  View,
  Modal,
  ScrollView,
} from "react-native";
import axios from "axios";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  faFilePen,
  faTrash,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";

const ProductionPengawas = () => {
  const [tanggal, setTanggal] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [grup, setGrup] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAllData, setShowAllData] = useState(false);
  const [groupedReports, setGroupedReports] = useState({});
  const [expandedReports, setExpandedReports] = useState({});
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const getUsername = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        console.log("Retrieved username:", username); // Log username
        setLoggedInUsername(username);
        fetchReports(); // Pastikan ini dipanggil setelah username diambil
      } catch (error) {
        console.error("Error retrieving username:", error);
      }
    };
    getUsername();
  }, []); // Array dependensi kosong memastikan ini hanya dipanggil sekali saat komponen dimount

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchReports();
      navigation.setParams({ refresh: undefined });
    }
  }, [route.params?.refresh]);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.83:3000/reports?status=Produksi"
      );
      const sortedReports = response.data.sort(
        (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
      );

      console.log("Fetched reports:", response.data);
      console.log("Logged in username:", loggedInUsername);

      const filteredByPic = sortedReports.filter(
        (report) =>
          report.pic.trim().toLowerCase() ===
          loggedInUsername.trim().toLowerCase()
      );

      console.log("Filtered reports by PIC:", filteredByPic);

      sortedReports.forEach((report) => {
        console.log(
          `Comparing report PIC: ${report.pic
            .trim()
            .toLowerCase()} with username: ${loggedInUsername
            .trim()
            .toLowerCase()}`
        );
      });

      const grouped = filteredByPic.reduce((acc, report) => {
        const key = report.operation_report_id;
        if (!acc[key]) {
          acc[key] = {
            ...report,
            details: [],
          };
        }
        acc[key].details.push(report);
        return acc;
      }, {});

      setGroupedReports(grouped); // Set grouped reports filtered by `pic`
      setReports(filteredByPic); // Set reports list filtered by `pic`
      setFilteredReports(filteredByPic); // Set filtered reports list
    } catch (error) {
      console.error(
        "Error fetching reports:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "Gagal mengambil data laporan. Silakan coba lagi nanti."
      );
    }
  };

  const toggleReportExpansion = (index) => {
    setExpandedReports((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmit = async () => {
    try {
      let url = "http://192.168.1.83:3000/reports?status=Produksi";

      if (startDate) {
        url += `&startDate=${format(new Date(startDate), "yyyy-MM-dd")}`;
      }
      if (endDate) {
        url += `&endDate=${format(new Date(endDate), "yyyy-MM-dd")}`;
      }
      if (grup) {
        url += `&grup=${encodeURIComponent(grup)}`;
      }
      if (lokasi) {
        url += `&lokasi=${encodeURIComponent(lokasi)}`;
      }

      console.log("Fetching data from URL:", url);

      const response = await axios.get(url);
      console.log("Response data:", response.data);

      // Filter reports based on startDate and endDate from operation report
      const sortedFilteredReports = response.data
        .filter((report) => {
          const reportDate = new Date(report.tanggal);
          const isAfterStartDate =
            !startDate || reportDate >= new Date(startDate);
          const isBeforeEndDate = !endDate || reportDate <= new Date(endDate);
          return isAfterStartDate && isBeforeEndDate;
        })
        .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

      console.log("Filtered reports:", sortedFilteredReports); // Log filtered reports

      // Update state with filtered reports
      setFilteredReports(sortedFilteredReports);
    } catch (error) {
      console.error(
        "Error searching reports:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "Gagal mencari data laporan. Silakan coba lagi nanti."
      );
    }
  };

  const handleDelete = async (productionReportId) => {
    console.log("Deleting production report with ID:", productionReportId);
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin menghapus laporan produksi ini?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          onPress: async () => {
            try {
              console.log(
                `Sending DELETE request to: http://192.168.1.83:3000/production-reports/${productionReportId}`
              );
              const response = await axios.delete(
                `http://192.168.1.83:3000/production-reports/${productionReportId}`
              );
              if (response.status === 200) {
                // Perbarui state lokal setelah penghapusan berhasil
                setFilteredReports((prevReports) =>
                  prevReports.filter(
                    (report) => report.id !== productionReportId
                  )
                );
                setReports((prevReports) =>
                  prevReports.filter(
                    (report) => report.id !== productionReportId
                  )
                );
                Alert.alert("Sukses", "Laporan produksi berhasil dihapus");

                fetchReports();
              }
            } catch (error) {
              console.error(
                "Error deleting production report:",
                error.response?.data || error.message
              );
              if (error.response && error.response.status === 404) {
                Alert.alert(
                  "Error",
                  "Laporan produksi tidak ditemukan. Mungkin sudah dihapus sebelumnya."
                );
              } else {
                Alert.alert(
                  "Error",
                  "Gagal menghapus laporan produksi. Silakan coba lagi."
                );
              }
            }
          },
        },
      ]
    );
  };

  const handleEdit = (report) => {
    navigation.navigate("EditProduction", { report });
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const onChangeTanggal = (event, selectedDate) => {
    const currentDate = selectedDate || tanggal;
    setShowDatePicker(false);
    setTanggal(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const showStartDatepicker = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatepicker = () => {
    setShowEndDatePicker(true);
  };

  const handleShowAllData = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.83:3000/reports?status=Produksi"
      );
      const sortedAllReports = response.data.sort(
        (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
      );
      setReports(sortedAllReports);
      setFilteredReports(sortedAllReports);
      setShowAllData(true);
      setStartDate(null);
      setEndDate(null);
      setGrup("");
      setLokasi("");
    } catch (error) {
      console.error("Error fetching all data:", error);
      Alert.alert("Error", "Gagal mengambil semua data. Silakan coba lagi.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.ScrollView}>
        <View style={styles.dateContainer}>
          <View style={styles.dateWrapper}>
            <Text style={styles.dateLabel}>Tanggal Awal :</Text>
            <TouchableOpacity
              onPress={showStartDatepicker}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerButtonText}>
                {startDate
                  ? format(new Date(startDate), "dd MMM yyyy")
                  : "Pilih Tanggal"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateWrapper}>
            <Text style={styles.dateLabel}>Tanggal Akhir :</Text>
            <TouchableOpacity
              onPress={showEndDatepicker}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerButtonText}>
                {endDate
                  ? format(new Date(endDate), "dd MMM yyyy")
                  : "Pilih Tanggal"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {showStartDatePicker && (
          <DateTimePicker
            testID="startDateTimePicker"
            value={startDate ? new Date(startDate) : new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeStartDate}
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            testID="endDateTimePicker"
            value={endDate ? new Date(endDate) : new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeEndDate}
          />
        )}

        {/* <Text style={[styles.label, styles.marginTopLabel]}>
          Giliran / Group:
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={setGrup}
          value={grup}
          placeholder="Input Data"
          placeholderTextColor="#888"
        />

        <Text style={[styles.label, styles.marginTopLabel]}>Lokasi Kerja:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setLokasi}
          value={lokasi}
          placeholder="Input Data"
          placeholderTextColor="#888"
        /> */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>SEARCH DATA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleShowAllData}>
            <Text style={styles.buttonText}>ALL DATA</Text>
          </TouchableOpacity>
        </View>

        {Object.values(groupedReports).length > 0 ? (
          Object.values(groupedReports).map((report, index) => (
            <View key={index} style={styles.reportContainer}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportHeaderText}>
                  {formatDate(report.tanggal)}
                </Text>
                <TouchableOpacity onPress={() => toggleReportExpansion(index)}>
                  <Icon
                    name={
                      expandedReports[index] ? "chevron-up" : "chevron-down"
                    }
                    size={24}
                    color="#567C8D"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Shift</Text>
                <Text style={styles.reportValue}>: {report.shift}</Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Giliran / Group</Text>
                <Text style={styles.reportValue}>: {report.grup}</Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Pengawas</Text>
                <Text style={styles.reportValue}>: {report.pengawas}</Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Lokasi Kerja</Text>
                <Text style={styles.reportValue}>: {report.lokasi}</Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Status</Text>
                <Text style={styles.reportValue}>: {report.status}</Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>PIC</Text>
                <Text style={styles.reportValue}>: {report.pic}</Text>
              </View>
              {expandedReports[index] && (
                <View>
                  <View style={styles.reportTable}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.tableHeaderText}>
                        Laporan Produksi
                      </Text>
                    </View>
                    {report.details.map((detail, detailIndex) => (
                      <View key={detailIndex} style={styles.tableRow}>
                        <View style={styles.tableCell}>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}>Executor </Text>
                            <Text style={styles.tableCellValue}>
                              {detail.excecutor}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}>Alat Gali</Text>
                            <Text style={styles.tableCellValue}>
                              {detail.alat}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}>Timbunan</Text>
                            <Text style={styles.tableCellValue}>
                              {detail.timbunan}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}>Material</Text>
                            <Text style={styles.tableCellValue}>
                              {detail.material}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}>
                              Jarak Angkut
                            </Text>
                            <Text style={styles.tableCellValue}>
                              {detail.jarak}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}>
                              Tipe Hauler
                            </Text>
                            <Text style={styles.tableCellValue}>
                              {detail.tipe}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}></Text>
                            <Text style={styles.tableCellValue}>
                              {detail.tipe2}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}>Ritase</Text>
                            <Text style={styles.tableCellValue}>
                              {detail.ritase}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}></Text>
                            <Text style={styles.tableCellValue}>
                              {detail.ritase2}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}>
                              Total Ritase
                            </Text>
                            <Text style={styles.tableCellValue}>
                              {detail.total_ritase}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}>Volume</Text>
                            <Text style={styles.tableCellValue}>
                              {detail.volume}
                            </Text>
                          </View>
                          <View style={styles.row}>
                            <Text style={styles.tableCellLabel}>Proses</Text>
                            <Text style={styles.tableCellValue}>
                              {detail.proses_admin}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => handleEdit(report)}
                      style={styles.editButton}
                    >
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        size={20}
                        color="#F5EFEB"
                        style={styles.iconEdit}
                      />
                      <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleEdit(report)}
                      style={styles.editButton2}
                    >
                      <FontAwesomeIcon
                        icon={faThumbsDown}
                        size={20}
                        color="#F5EFEB"
                        style={styles.iconEdit}
                      />
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C8D9E6",
  },
  ScrollView: {
    paddingBottom: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: -5,
    borderRadius: 15,
    borderColor: "#0a2764",
  },
  label: {
    marginLeft: 12,
    marginBottom: -4,
    fontSize: 12,
    color: "#071739",
  },
  marginTopLabel: {
    marginTop: 20,
    marginLeft: 20,
    fontWeight: "bold",
    color: "#0a2764",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#093a5d",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    height: 50,
  },
  buttonText: {
    color: "#F5EFEB",
    fontSize: 15,
    textAlign: "center",
    marginLeft: 5,
  },
  reportContainer: {
    margin: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#C8D9E6",
    borderRadius: 5,
    backgroundColor: "#F5EFEB",
  },
  reportText: {
    fontSize: 14,
    color: "#0a2764",
    marginBottom: 5,
  },
  noDataText: {
    margin: 12,
    fontSize: 16,
    color: "##0a2764",
  },
  subheader: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  datePickerButton: {
    height: 40,
    margin: 12,
    marginBottom: -5,
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    borderRadius: 15,
  },
  datePickerButtonText: {
    color: "#000",
  },

  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  reportLabel: {
    flex: 1,
    fontWeight: "bold",
    color: "#567C8D",
  },
  reportValue: {
    flex: 2,
    color: "#567C8D",
  },
  separator: {
    height: 1,
    backgroundColor: "#567C8D",
    marginVertical: 10,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reportHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#567C8D",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 20,
  },
  dateWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0a2764",
    marginBottom: 5,
  },
  datePickerButton: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    borderRadius: 15,
    borderColor: "#0a2764",
  },
  datePickerButtonText: {
    color: "#000",
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#e87600",
    padding: 10,
    borderRadius: 15,
    width: 110,
    flexDirection: "row",
    alignItems: "center",
  },
  editButton2: {
    backgroundColor: "#e87600",
    padding: 10,
    borderRadius: 15,
    width: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  iconEdit: {
    textAlign: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  deleteButton: {
    backgroundColor: "#801414",
    padding: 10,
    borderRadius: 15,
    width: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#2F4156",
    padding: 10,
    borderRadius: 5,
  },
  reportTable: {
    borderWidth: 1,
    borderColor: "#567C8D",
    borderRadius: 5,
    marginVertical: 10,
  },
  tableHeader: {
    backgroundColor: "#C8D9E6",
    padding: 10,
    alignItems: "center",
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#0a2764",
  },
  tableRow: {
    flexDirection: "column",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#567C8D",
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  tableCellLabel: {
    fontWeight: "bold",
    color: "#567C8D",
    flex: 1,
  },
  tableCellValue: {
    flex: 2,
    textAlign: "left",
  },
});

export default ProductionPengawas;
